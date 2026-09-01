import fs from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'node-html-parser';

const ROOT_DIR = process.cwd();
const SOURCE_DIR = path.join(ROOT_DIR, 'htmls');
const OUTPUT_DIR = path.join(ROOT_DIR, 'src', 'generated', 'html-screens');

const SELF_CLOSING_TAGS = new Set(['img', 'input', 'meta', 'link', 'br', 'hr']);
const VIEW_TAGS = new Set([
  'body',
  'main',
  'section',
  'header',
  'footer',
  'nav',
  'div',
  'article',
  'aside',
  'ul',
  'ol',
  'li',
  'form',
  'label',
]);
const TEXT_TAGS = new Set([
  'span',
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'strong',
  'em',
  'small',
  'b',
  'i',
]);
const INTERACTIVE_TAGS = new Set(['button', 'a']);
const INPUT_TAGS = new Set(['input', 'textarea', 'select']);
const DROP_CLASS_PREFIXES = [
  'hover:',
  'focus:',
  'active:',
  'group-hover:',
  'transition',
  'duration-',
  'ease-',
  'cursor-',
  'backdrop-blur',
  'container-',
];

function toKebabCase(fileName) {
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .toLowerCase();
}

function toPascalCase(fileName) {
  return toKebabCase(fileName)
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function normalizeWhitespace(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ');
}

function escapeText(text) {
  return JSON.stringify(text);
}

function getClassList(className) {
  if (!className) return [];
  return className
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function transformClassName(className, context = {}) {
  const tokens = getClassList(className);
  const transformed = [];

  for (const token of tokens) {
    if (token === 'group') continue;
    if (token === 'material-symbols-outlined') continue;
    if (token === 'pb-safe') {
      transformed.push('pb-4');
      continue;
    }
    if (DROP_CLASS_PREFIXES.some((prefix) => token.startsWith(prefix))) {
      continue;
    }
    if (token === 'fixed' || token === 'sticky') {
      transformed.push('absolute');
      continue;
    }
    if (token === 'grid') {
      transformed.push('flex');
      continue;
    }
    if (/^grid-cols-\d+$/.test(token)) {
      continue;
    }
    if (/^min-h-\[\d+px\]$/.test(token)) {
      transformed.push(token);
      continue;
    }
    transformed.push(token);
  }

  if (context.parentGridColumns && context.isDirectChild) {
    const widthByColumns = {
      2: 'w-full md:w-[48%]',
      3: 'w-full md:w-[31%]',
      4: 'w-full md:w-[23%]',
    };
    const widthClass = widthByColumns[context.parentGridColumns];
    if (
      widthClass &&
      !tokens.some((token) => token.startsWith('w-')) &&
      !tokens.includes('absolute') &&
      !tokens.includes('hidden')
    ) {
      transformed.push(...widthClass.split(' '));
    }
  }

  if (tokens.includes('grid') && context.gridColumns) {
    transformed.push('flex-col');
    if (context.gridColumns > 1) {
      transformed.push('md:flex-row', 'md:flex-wrap');
    }
  }

  return Array.from(new Set(transformed)).join(' ').trim();
}

function getGridColumns(className) {
  const tokens = getClassList(className);
  const match = tokens.find((token) => /^grid-cols-\d+$/.test(token));
  if (!match) return null;
  return Number.parseInt(match.replace('grid-cols-', ''), 10);
}

function mapTagToComponent(tagName) {
  if (VIEW_TAGS.has(tagName)) return 'View';
  if (TEXT_TAGS.has(tagName)) return 'Text';
  if (tagName === 'img') return 'Image';
  if (INTERACTIVE_TAGS.has(tagName)) return 'TouchableOpacity';
  if (INPUT_TAGS.has(tagName)) return 'TextInput';
  return 'View';
}

function isMeaningfulText(node) {
  return node.nodeType === 3 && normalizeWhitespace(node.rawText).trim().length > 0;
}

function isMaterialSymbol(node) {
  if (!node || node.nodeType !== 1 || node.tagName?.toLowerCase() !== 'span') return false;
  const className = node.getAttribute('class') || '';
  return className.includes('material-symbols-outlined');
}

function isTextLikeNode(node) {
  if (!node || node.nodeType !== 1) return false;
  if (isMaterialSymbol(node)) return true;
  const tagName = node.tagName?.toLowerCase();
  return TEXT_TAGS.has(tagName);
}

function shouldRenderAsText(node) {
  const tagName = node.tagName?.toLowerCase();
  if (!TEXT_TAGS.has(tagName)) return false;

  const childElements = (node.childNodes || []).filter((child) => child.nodeType === 1);
  return childElements.every((child) => isTextLikeNode(child));
}

function getIconName(node) {
  return normalizeWhitespace(node.text || '').trim() || 'help_outline';
}

function buildAttributes(node, componentName, className, extra = {}) {
  const attrs = [];
  if (className) {
    attrs.push(`className=${escapeText(className)}`);
  }

  if (componentName === 'Image') {
    const src = node.getAttribute('src') || '';
    if (src) {
      attrs.push(`source={{ uri: ${escapeText(src)} }}`);
    }
    const alt = node.getAttribute('alt') || node.getAttribute('data-alt') || 'Image';
    attrs.push(`accessibilityLabel=${escapeText(alt)}`);
  }

  if (componentName === 'TouchableOpacity') {
    attrs.push('accessibilityRole="button"');
    attrs.push('activeOpacity={0.85}');
  }

  if (componentName === 'TextInput') {
    const placeholder =
      node.getAttribute('placeholder') ||
      node.getAttribute('value') ||
      node.getAttribute('aria-label') ||
      '';
    if (placeholder) {
      attrs.push(`placeholder=${escapeText(placeholder)}`);
    }
    const inputType = node.getAttribute('type') || '';
    if (inputType === 'password') {
      attrs.push('secureTextEntry');
    }
    if (node.tagName?.toLowerCase() === 'textarea' || inputType === 'date' || inputType === 'time') {
      attrs.push('multiline');
    }
  }

  for (const [key, value] of Object.entries(extra)) {
    attrs.push(`${key}=${value}`);
  }

  return attrs.length ? ` ${attrs.join(' ')}` : '';
}

function renderTextNode(node, depth) {
  const rawText = normalizeWhitespace(node.rawText);
  if (!rawText.trim()) return '';
  return `${'  '.repeat(depth)}{${escapeText(rawText)}}`;
}

function renderChildren(node, depth, context) {
  const lines = [];
  const childNodes = node.childNodes || [];

  for (const child of childNodes) {
    if (child.nodeType === 8) continue;
    if (isMeaningfulText(child)) {
      if (context.parentComponent === 'Text') {
        lines.push(renderTextNode(child, depth));
      } else {
        lines.push(`${'  '.repeat(depth)}<Text>${renderTextNode(child, 0).trim()}</Text>`);
      }
      continue;
    }

    if (child.nodeType !== 1) continue;

    const childOutput = renderNode(child, depth, {
      parentComponent: context.parentComponent,
      parentGridColumns: context.gridColumns,
      isDirectChild: true,
    });

    if (childOutput) {
      lines.push(childOutput);
    }
  }

  return lines;
}

function renderNode(node, depth = 0, inheritedContext = {}) {
  if (node.nodeType !== 1) return '';

  const tagName = node.tagName.toLowerCase();
  if (['script', 'style', 'meta', 'link', 'title', 'head', 'html'].includes(tagName)) {
    return '';
  }

  if (isMaterialSymbol(node)) {
    const className = transformClassName(node.getAttribute('class') || '');
    const indent = '  '.repeat(depth);
    return `${indent}<MaterialIcons className=${escapeText(className)} name={${escapeText(getIconName(node))} as MaterialIconName} />`;
  }

  const componentName = shouldRenderAsText(node) ? 'Text' : mapTagToComponent(tagName);
  const className = transformClassName(node.getAttribute('class') || '', {
    gridColumns: getGridColumns(node.getAttribute('class') || ''),
    parentGridColumns: inheritedContext.parentGridColumns,
    isDirectChild: inheritedContext.isDirectChild,
  });
  const attributes = buildAttributes(node, componentName, className);
  const indent = '  '.repeat(depth);

  if (SELF_CLOSING_TAGS.has(tagName) || componentName === 'Image' || componentName === 'TextInput') {
    return `${indent}<${componentName}${attributes} />`;
  }

  const childLines = renderChildren(node, depth + 1, {
    parentComponent: componentName,
    gridColumns: getGridColumns(node.getAttribute('class') || ''),
  });

  if (childLines.length === 0) {
    return `${indent}<${componentName}${attributes} />`;
  }

  return [`${indent}<${componentName}${attributes}>`, ...childLines, `${indent}</${componentName}>`].join('\n');
}

function getBodyClassName(root) {
  return transformClassName(root.querySelector('body')?.getAttribute('class') || 'bg-white');
}

function hasFixedPosition(node) {
  if (node.nodeType !== 1) return false;
  const className = node.getAttribute('class') || '';
  return /\b(fixed|sticky)\b/.test(className);
}

function buildComponentSource(fileName, html) {
  const preparedHtml = html
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  const root = parse(preparedHtml, {
    comment: true,
    lowerCaseTagName: true,
  });
  const body = root.querySelector('body');
  const sourceRoot = body ?? root;
  const children = (sourceRoot.childNodes || []).filter((node) => {
    if (node.nodeType === 8) return false;
    if (node.nodeType === 3) return normalizeWhitespace(node.rawText).trim().length > 0;
    return node.nodeType === 1;
  });

  const fixedChildren = [];
  const scrollChildren = [];

  for (const child of children) {
    if (child.nodeType === 1 && hasFixedPosition(child)) {
      fixedChildren.push(child);
    } else {
      scrollChildren.push(child);
    }
  }

  const componentName = `${toPascalCase(fileName)}Screen`;
  const bodyClassName = getBodyClassName(root) || 'flex-1 bg-white';
  const fixedOutput = fixedChildren
    .map((child) => renderNode(child, 2, { isDirectChild: true }))
    .filter(Boolean)
    .join('\n');
  const scrollOutput = scrollChildren
    .map((child) => renderNode(child, 3, { isDirectChild: true }))
    .filter(Boolean)
    .join('\n');

  return `// @ts-nocheck
import React from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];

cssInterop(MaterialIcons, {
  className: {
    target: 'style',
  },
});

export default function ${componentName}() {
  return (
    <View className=${escapeText(`flex-1 ${bodyClassName}`.trim())}>
${fixedOutput ? `${fixedOutput}\n` : ''}      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
${scrollOutput}
      </ScrollView>
    </View>
  );
}
`;
}

function buildRegistrySource(entries) {
  const importLines = entries
    .map(
      ({ fileName, slug }) =>
        `import ${toPascalCase(fileName)}Screen from './${slug}';`,
    )
    .join('\n');

  const itemLines = entries
    .map(
      ({ fileName, slug }) =>
        `  {\n    slug: '${slug}',\n    title: ${escapeText(fileName.replace(/\.[^.]+$/, ''))},\n    component: ${toPascalCase(fileName)}Screen,\n  },`,
    )
    .join('\n');

  return `import type { ComponentType } from 'react';
${importLines}

export interface GeneratedHtmlScreenEntry {
  slug: string;
  title: string;
  component: ComponentType;
}

export const generatedHtmlScreens: GeneratedHtmlScreenEntry[] = [
${itemLines}
];

export const generatedHtmlScreenMap = Object.fromEntries(
  generatedHtmlScreens.map((entry) => [entry.slug, entry.component]),
) as Record<string, ComponentType>;
`;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const fileNames = await fs.readdir(SOURCE_DIR);
  const sourceFiles = fileNames.sort((left, right) => left.localeCompare(right));
  const entries = [];

  for (const fileName of sourceFiles) {
    const sourcePath = path.join(SOURCE_DIR, fileName);
    const stat = await fs.stat(sourcePath);
    if (!stat.isFile()) continue;

    const html = await fs.readFile(sourcePath, 'utf8');
    const outputFileName = `${toKebabCase(fileName)}.tsx`;
    const outputPath = path.join(OUTPUT_DIR, outputFileName);
    const componentSource = buildComponentSource(fileName, html);
    await fs.writeFile(outputPath, componentSource, 'utf8');
    entries.push({
      fileName,
      slug: outputFileName.replace(/\.tsx$/, ''),
    });
  }

  const registrySource = buildRegistrySource(entries);
  await fs.writeFile(path.join(OUTPUT_DIR, 'index.ts'), registrySource, 'utf8');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
