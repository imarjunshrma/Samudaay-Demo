import { createAndDeliverPdfFromHtml } from '@/src/services/files/pdf-file';
import { createAndDeliverBase64File } from '@/src/services/files/report-file';
import { communityConfig } from '@/src/core/config/community';
import { DONATION_RECEIPT_LOGO_URI } from './donation-receipt-assets';

export type AnalyticsExportFormat = 'pdf' | 'excel';

const XLSX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export type AnalyticsReportSummaryItem = {
  label: string;
  value: string;
};

export type AnalyticsReportTable = {
  title: string;
  columns: string[];
  rows: (string | number | null | undefined)[][];
};

export type AnalyticsReportSection = {
  title: string;
  items: AnalyticsReportSummaryItem[];
};

type DownloadAnalyticsReportOptions = {
  title: string;
  subtitle?: string;
  fileBaseName: string;
  summary?: AnalyticsReportSummaryItem[];
  sections?: AnalyticsReportSection[];
  tables?: AnalyticsReportTable[];
  format: AnalyticsExportFormat;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeCell(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return '';
  }

  const normalized = String(value);
  if (!normalized.trim()) {
    return '';
  }

  return formatReportDateValue(normalized) ?? normalized;
}

function formatReportDateValue(value: string) {
  const trimmed = value.trim();
  const isoDateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:?\d{2})?$/;
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
  const numericTimestampPattern = /^\d{13}$/;

  if (!isoDateTimePattern.test(trimmed) && !isoDatePattern.test(trimmed) && !numericTimestampPattern.test(trimmed)) {
    return null;
  }

  const date = numericTimestampPattern.test(trimmed) ? new Date(Number(trimmed)) : new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (isoDatePattern.test(trimmed)) {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function renderSummary(items: AnalyticsReportSummaryItem[]) {
  if (!items.length) {
    return '';
  }

  return `
    <section style="margin-bottom:24px;">
      <h2 style="font-size:16px;margin:0 0 12px;">Summary</h2>
      <table style="width:100%;border-collapse:collapse;">
        ${items.map((item) => `
          <tr>
            <td style="padding:8px 10px;border:1px solid #e5e7eb;font-weight:600;background:#fff7ed;">${escapeHtml(item.label)}</td>
            <td style="padding:8px 10px;border:1px solid #e5e7eb;">${escapeHtml(normalizeCell(item.value))}</td>
          </tr>
        `).join('')}
      </table>
    </section>
  `;
}

function renderSections(sections: AnalyticsReportSection[]) {
  return sections.map((section) => `
    <section style="margin-bottom:24px;">
      <h2 style="font-size:16px;margin:0 0 12px;">${escapeHtml(section.title)}</h2>
      <table style="width:100%;border-collapse:collapse;">
        ${section.items.map((item) => `
          <tr>
            <td style="padding:8px 10px;border:1px solid #e5e7eb;font-weight:600;background:#f8fafc;">${escapeHtml(item.label)}</td>
            <td style="padding:8px 10px;border:1px solid #e5e7eb;">${escapeHtml(normalizeCell(item.value))}</td>
          </tr>
        `).join('')}
      </table>
    </section>
  `).join('');
}

function renderTables(tables: AnalyticsReportTable[]) {
  const tableStyle = 'width:max-content;min-width:100%;border-collapse:collapse;table-layout:auto;font-size:10px;';
  const cellStyle = 'padding:6px 8px;border:1px solid #e5e7eb;white-space:nowrap;vertical-align:top;';

  return tables.map((table) => `
    <section style="margin-bottom:24px;">
      <h2 style="font-size:16px;margin:0 0 12px;">${escapeHtml(table.title)}</h2>
      <div style="width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;">
        <table style="${tableStyle}">
          <thead>
            <tr>
              ${table.columns.map((column) => `
                <th style="${cellStyle}background:#f97316;color:#ffffff;text-align:left;font-weight:700;">${escapeHtml(column)}</th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            ${table.rows.map((row) => `
              <tr>
                ${row.map((cell) => `
                  <td style="${cellStyle}">${escapeHtml(normalizeCell(cell))}</td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `).join('');
}

function renderReportHeader(title: string, subtitle?: string) {
  const tenantName = communityConfig.tenantName || communityConfig.brandName || 'Community';

  return `
    <header style="margin-bottom:24px;border-bottom:2px solid #f97316;padding-bottom:16px;">
      <div style="display:flex;align-items:center;gap:16px;">
        <img src="${DONATION_RECEIPT_LOGO_URI}" alt="Community logo" style="width:56px;height:56px;object-fit:contain;" />
        <div>
          <div style="font-size:20px;font-weight:700;color:#111827;">${escapeHtml(tenantName)}</div>
          <h1 style="font-size:24px;margin:4px 0 0;">${escapeHtml(title)}</h1>
          ${subtitle ? `<p style="margin:6px 0 0;color:#6b7280;">${escapeHtml(subtitle)}</p>` : ''}
        </div>
      </div>
    </header>
  `;
}

function buildPrintableHtml({
  title,
  subtitle,
  summary = [],
  sections = [],
  tables = [],
}: Omit<DownloadAnalyticsReportOptions, 'fileBaseName' | 'format'>) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          @page { size: A4 landscape; margin: 16px; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        </style>
      </head>
      <body style="font-family:Arial,sans-serif;padding:24px;color:#1f2937;">
        ${renderReportHeader(title, subtitle)}
        ${renderSummary(summary)}
        ${renderSections(sections)}
        ${renderTables(tables)}
      </body>
    </html>
  `;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSpreadsheetRows({
  title,
  subtitle,
  summary = [],
  sections = [],
  tables = [],
}: Omit<DownloadAnalyticsReportOptions, 'fileBaseName' | 'format'>) {
  const rows: (string | number | null | undefined)[][] = [];

  rows.push([communityConfig.tenantName || communityConfig.brandName || 'Community']);
  rows.push([title]);
  if (subtitle) {
    rows.push([subtitle]);
  }
  rows.push([]);

  if (summary.length) {
    rows.push(['Summary']);
    summary.forEach((item) => rows.push([item.label, item.value]));
    rows.push([]);
  }

  sections.forEach((section) => {
    rows.push([section.title]);
    section.items.forEach((item) => rows.push([item.label, item.value]));
    rows.push([]);
  });

  tables.forEach((table) => {
    rows.push([table.title]);
    rows.push(table.columns);
    table.rows.forEach((row) => rows.push(row));
    rows.push([]);
  });

  return rows;
}

function getColumnName(columnIndex: number) {
  let dividend = columnIndex + 1;
  let columnName = '';

  while (dividend > 0) {
    const modulo = (dividend - 1) % 26;
    columnName = String.fromCharCode(65 + modulo) + columnName;
    dividend = Math.floor((dividend - modulo) / 26);
  }

  return columnName;
}

function renderWorksheetCell(value: string | number | null | undefined, columnIndex: number, rowIndex: number) {
  const reference = `${getColumnName(columnIndex)}${rowIndex}`;

  if (typeof value === 'number' && Number.isFinite(value)) {
    return `<c r="${reference}"><v>${value}</v></c>`;
  }

  const normalizedValue = normalizeCell(value);
  if (!normalizedValue) {
    return `<c r="${reference}"/>`;
  }

  return `<c r="${reference}" t="inlineStr"><is><t>${escapeXml(normalizedValue)}</t></is></c>`;
}

function buildWorksheetXml(rows: (string | number | null | undefined)[][]) {
  const maxColumns = Math.max(1, ...rows.map((row) => row.length));
  const columnsXml = Array.from({ length: maxColumns }, (_, index) => {
    const width = index === 0 ? 28 : 20;
    return `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`;
  }).join('');

  const rowsXml = rows.map((row, index) => {
    const rowIndex = index + 1;
    return `<row r="${rowIndex}">${row.map((cell, columnIndex) => renderWorksheetCell(cell, columnIndex, rowIndex)).join('')}</row>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <cols>${columnsXml}</cols>
  <sheetData>${rowsXml}</sheetData>
</worksheet>`;
}

function encodeUtf8(value: string) {
  const bytes: number[] = [];

  for (let index = 0; index < value.length; index += 1) {
    let codePoint = value.charCodeAt(index);

    if (codePoint >= 0xd800 && codePoint <= 0xdbff && index + 1 < value.length) {
      const next = value.charCodeAt(index + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        codePoint = 0x10000 + ((codePoint - 0xd800) << 10) + (next - 0xdc00);
        index += 1;
      }
    }

    if (codePoint <= 0x7f) {
      bytes.push(codePoint);
    } else if (codePoint <= 0x7ff) {
      bytes.push(0xc0 | (codePoint >> 6), 0x80 | (codePoint & 0x3f));
    } else if (codePoint <= 0xffff) {
      bytes.push(0xe0 | (codePoint >> 12), 0x80 | ((codePoint >> 6) & 0x3f), 0x80 | (codePoint & 0x3f));
    } else {
      bytes.push(
        0xf0 | (codePoint >> 18),
        0x80 | ((codePoint >> 12) & 0x3f),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f),
      );
    }
  }

  return new Uint8Array(bytes);
}

const crcTable = (() => {
  const table: number[] = [];

  for (let index = 0; index < 256; index += 1) {
    let crc = index;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
    table[index] = crc >>> 0;
  }

  return table;
})();

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;

  for (let index = 0; index < bytes.length; index += 1) {
    crc = crcTable[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function writeUint16LE(target: number[], value: number) {
  target.push(value & 0xff, (value >>> 8) & 0xff);
}

function writeUint32LE(target: number[], value: number) {
  target.push(value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff);
}

function concatBytes(parts: Uint8Array[]) {
  const size = parts.reduce((total, part) => total + part.length, 0);
  const combined = new Uint8Array(size);
  let offset = 0;

  parts.forEach((part) => {
    combined.set(part, offset);
    offset += part.length;
  });

  return combined;
}

function toUint8Array(values: number[], suffix?: Uint8Array) {
  const bytes = new Uint8Array(values.length + (suffix?.length ?? 0));
  bytes.set(values, 0);
  if (suffix) {
    bytes.set(suffix, values.length);
  }

  return bytes;
}

function bytesToBase64(bytes: Uint8Array) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';

  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index];
    const second = bytes[index + 1];
    const third = bytes[index + 2];
    const triplet = (first << 16) | ((second ?? 0) << 8) | (third ?? 0);

    output += alphabet[(triplet >> 18) & 0x3f];
    output += alphabet[(triplet >> 12) & 0x3f];
    output += index + 1 < bytes.length ? alphabet[(triplet >> 6) & 0x3f] : '=';
    output += index + 2 < bytes.length ? alphabet[triplet & 0x3f] : '=';
  }

  return output;
}

function buildZipBase64(files: { name: string; content: string }[]) {
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  files.forEach((file) => {
    const nameBytes = encodeUtf8(file.name);
    const contentBytes = encodeUtf8(file.content);
    const checksum = crc32(contentBytes);
    const localHeader: number[] = [];

    writeUint32LE(localHeader, 0x04034b50);
    writeUint16LE(localHeader, 20);
    writeUint16LE(localHeader, 0x0800);
    writeUint16LE(localHeader, 0);
    writeUint16LE(localHeader, 0);
    writeUint16LE(localHeader, 0);
    writeUint32LE(localHeader, checksum);
    writeUint32LE(localHeader, contentBytes.length);
    writeUint32LE(localHeader, contentBytes.length);
    writeUint16LE(localHeader, nameBytes.length);
    writeUint16LE(localHeader, 0);

    const localHeaderBytes = toUint8Array(localHeader, nameBytes);
    localParts.push(localHeaderBytes, contentBytes);

    const centralHeader: number[] = [];
    writeUint32LE(centralHeader, 0x02014b50);
    writeUint16LE(centralHeader, 20);
    writeUint16LE(centralHeader, 20);
    writeUint16LE(centralHeader, 0x0800);
    writeUint16LE(centralHeader, 0);
    writeUint16LE(centralHeader, 0);
    writeUint16LE(centralHeader, 0);
    writeUint32LE(centralHeader, checksum);
    writeUint32LE(centralHeader, contentBytes.length);
    writeUint32LE(centralHeader, contentBytes.length);
    writeUint16LE(centralHeader, nameBytes.length);
    writeUint16LE(centralHeader, 0);
    writeUint16LE(centralHeader, 0);
    writeUint16LE(centralHeader, 0);
    writeUint16LE(centralHeader, 0);
    writeUint32LE(centralHeader, 0);
    writeUint32LE(centralHeader, offset);

    centralParts.push(toUint8Array(centralHeader, nameBytes));
    offset += localHeaderBytes.length + contentBytes.length;
  });

  const centralDirectory = concatBytes(centralParts);
  const endOfCentralDirectory: number[] = [];
  writeUint32LE(endOfCentralDirectory, 0x06054b50);
  writeUint16LE(endOfCentralDirectory, 0);
  writeUint16LE(endOfCentralDirectory, 0);
  writeUint16LE(endOfCentralDirectory, files.length);
  writeUint16LE(endOfCentralDirectory, files.length);
  writeUint32LE(endOfCentralDirectory, centralDirectory.length);
  writeUint32LE(endOfCentralDirectory, offset);
  writeUint16LE(endOfCentralDirectory, 0);

  return bytesToBase64(concatBytes([...localParts, centralDirectory, toUint8Array(endOfCentralDirectory)]));
}

function buildSpreadsheetXlsx(options: Omit<DownloadAnalyticsReportOptions, 'fileBaseName' | 'format'>) {
  const rows = buildSpreadsheetRows(options);
  const worksheetXml = buildWorksheetXml(rows);

  return buildZipBase64([
    {
      name: '[Content_Types].xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`,
    },
    {
      name: '_rels/.rels',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`,
    },
    {
      name: 'xl/workbook.xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="Report" sheetId="1" r:id="rId1"/></sheets>
</workbook>`,
    },
    {
      name: 'xl/_rels/workbook.xml.rels',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`,
    },
    {
      name: 'xl/styles.xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>
  <fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>
  <borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>
</styleSheet>`,
    },
    {
      name: 'xl/worksheets/sheet1.xml',
      content: worksheetXml,
    },
  ]);
}

export async function downloadAnalyticsReport(options: DownloadAnalyticsReportOptions) {
  const { format, fileBaseName, ...contentOptions } = options;

  if (format === 'pdf') {
    return createAndDeliverPdfFromHtml({
      html: buildPrintableHtml(contentOptions),
      fileName: `${fileBaseName}.pdf`,
    });
  }

  return createAndDeliverBase64File({
    base64Content: buildSpreadsheetXlsx(contentOptions),
    fileName: `${fileBaseName}.xlsx`,
    mimeType: XLSX_MIME_TYPE,
  });
}
