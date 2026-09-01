# Codex Refactor Prompt – Use `htmls/*.tsx` as Source and Build Reusable Expo App Code

Refactor the current Expo React Native app using the source screens already converted into `htmls/*.tsx`.

## Context

The files inside `htmls/` are no longer raw HTML references.  
They now contain screen-level TSX source code converted from the original designs.

Treat `htmls/*.tsx` as the primary source of truth for UI structure, layout, component breakdown opportunities, and screen intent.

The goal is NOT to keep these `htmls/*.tsx` files as final app code.

The goal is to use them as source material and transform them into a proper production-grade Expo React Native codebase with:

- real screens
- reusable components
- shared utilities
- shared styles/tokens
- feature-based organization
- minimal duplication
- clean TypeScript
- maintainable logic separation

Also use `mainrequirement.md` as the product and flow source of truth.

---

## Main Objective

Read all `htmls/*.tsx` files and refactor the app so that their source code is properly distributed into:

- reusable components
- feature modules
- real pages/screens
- shared hooks
- shared utilities
- constants
- theme-based styles

Do not leave the app as a collection of copied screen files.

Build a clean system from these screen sources.

---

## Inputs You Must Use

1. `htmls/*.tsx`
2. `mainrequirement.md`
3. existing Expo project structure and current routes/components

---

## Core Rules

### 1. Treat `htmls/*.tsx` as design-source code, not final architecture

- Inspect every file carefully
- Identify repeated UI sections, repeated styles, repeated logic, repeated layouts
- Extract what should become shared components
- Extract what should become feature-level components
- Extract what should become utilities/constants/types

Do NOT blindly copy each `htmls/*.tsx` file into app routes unchanged.

---

### 2. Build real reusable components

Extract reusable parts such as:

- headers
- cards
- summary/stat blocks
- list rows
- search bars
- filter bars
- action tiles
- avatar/profile blocks
- form sections
- section wrappers
- timeline rows
- gallery cards
- event cards
- donation cards
- settings rows
- approval/action bars
- upload/document rows
- chips/tags/pills
- tab headers
- empty states
- loading/skeleton variants

Put shared generic components under:

- `src/components/ui`
- `src/components/common`

Put feature-specific reusable components under:

- `src/features/<feature>/components`

---

### 3. Build proper pages/screens

For each meaningful screen represented in `htmls/*.tsx`:

- create a real route/screen file
- assign it to the correct feature/module
- keep it small and readable
- compose it from reusable components where possible

Do not keep giant monolithic screen files unless absolutely necessary.

---

### 4. Reduce duplication aggressively

If the same pattern appears in 2 or more `htmls/*.tsx` files:

- extract it

This includes:

- JSX structure
- style objects
- repeated spacing/layout patterns
- form field patterns
- repeated labels and sections
- repeated empty/loading/error patterns

---

### 5. Use the existing theme/tokens properly

- centralize colors
- centralize spacing
- centralize radius
- centralize typography
- centralize shadow patterns

Do not keep repeated hardcoded colors or layout values from the source files if they can be tokenized.

Preserve the visual intent from `htmls/*.tsx`, but convert it into maintainable native styling.

---

### 6. Keep architecture clean

Use or improve this structure:

```txt
src/
  app/
    providers/
    navigation/
  components/
    ui/
    common/
  features/
    auth/
      components/
      screens/
      hooks/
      services/
      types/
      constants/
    registration/
      components/
      screens/
      hooks/
      services/
      types/
      constants/
    profile/
      components/
      screens/
      hooks/
      services/
      types/
      constants/
    events/
      components/
      screens/
      hooks/
      services/
      types/
      constants/
    finance/
      components/
      screens/
      hooks/
      services/
      types/
      constants/
    directory/
      components/
      screens/
      hooks/
      services/
      types/
      constants/
    dashboard/
      components/
      screens/
      hooks/
      services/
      types/
      constants/
    admin/
      components/
      screens/
      hooks/
      services/
      types/
      constants/
  services/
    firebase/
  theme/
  hooks/
  utils/
  constants/
  types/
  assets/
```

If a better equivalent structure already exists, extend it instead of rebuilding.

---

### 7. Separate UI from logic

- screen file = composition/orchestration
- feature components = reusable screen sections
- hooks = view/state logic
- services = Firebase/API/data layer
- utils = pure helpers
- constants = labels/config/enums where appropriate

Do not bury complex logic inside large JSX blocks.

---

### 8. Keep current working integrations intact

Do not break the existing:

- Expo Router structure
- Firebase auth flow
- Firestore-backed flows
- Storage-backed KYC flow
- navigation guards
- role-based access
- loading/skeleton patterns
- button loading states

Refactor around them, not against them.

---

### 9. Use source files to improve actual app screens

For every `htmls/*.tsx` file:

- map it to an existing route if that route already exists
- otherwise create the missing route if it is a real app screen
- update existing screens to better match the source layout where needed
- use the source to improve visual fidelity and missing sections

---

### 10. Accessibility and production quality

All extracted components and refactored screens must:

- use strict TypeScript
- avoid `any`
- support accessibility labels/roles where relevant
- keep touch targets usable
- preserve loading/error/empty states
- work with smaller screens
- avoid unreadable mega-files

---

## Refactor Strategy

Follow this process:

1. analyze all `htmls/*.tsx` files
2. group them by feature and screen type
3. identify repeated patterns
4. create shared component extraction plan
5. create/upgrade reusable UI components
6. refactor app screens to use these shared components
7. extract shared helpers/constants/types
8. remove duplication
9. keep navigation and data flows working
10. leave the app cleaner than before

---

## Important Constraints

- do not rewrite the whole app from scratch
- do not discard current working Firebase/navigation infrastructure
- do not keep raw converted source code duplicated across routes
- do not create a “one source file = one final screen copy” system
- do not over-abstract tiny one-off sections
- do not reduce everything into generic meaningless wrappers
- prefer useful, understandable reuse

---

## What I expect as output

Refactor the project so that the final codebase contains:

- cleaner screen files
- extracted reusable components
- extracted shared utilities/constants/types
- improved alignment between the app and the `htmls/*.tsx` source screens
- reduced duplication across the project
- maintainable feature structure

---

## Deliverable Summary Required

After completing the refactor, provide:

1. which `htmls/*.tsx` files were mapped to which app screens
2. which shared components were created
3. which feature-specific components were created
4. which utilities/constants/types were extracted
5. which screens were significantly improved from source fidelity
6. any source files that were redundant, overlapping, or not turned into separate screens
7. any areas still needing manual visual QA

---

## Final Instruction

Use `htmls/*.tsx` as the source design/code input and transform the current app into a cleaner, more reusable, more component-driven Expo React Native codebase.

Do the refactor directly in code, not as a plan.
