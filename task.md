# Codex Prompt: Convert Stitch HTML Screens into a Fully Structured Expo React Native App

You are working inside an existing Expo React Native project.

The project setup already exists.

Your task is to convert all design/exported screens inside the `htmls/` folder into a clean, scalable, reusable, production-structured Expo React Native app.

There is also a file named `mainrequirement.md` which contains the client requirements. Treat that file as the primary source of truth for feature intent, naming, user flows, business expectations, and screen priorities.

---

## Main Objective

Convert all available HTML screens from the `html/` folder into Expo React Native screens and reusable components, while maintaining:

- clean architecture
- component reusability
- proper folder structure
- design consistency
- centralized colors and styling tokens
- accessibility
- no unnecessary duplication
- scalable logic organization
- readiness for future Firebase integration

This should result in a runnable Expo app with all screens converted into native React Native code.

---

## Source Files to Analyze

You must read and analyze:

- all files inside `html/`
- `mainrequirement.md`

Do not ignore any screen without a clear reason.

---

## Non-Negotiable Rules

### 1. Use React Native Properly

- Do not use HTML or DOM elements
- Do not use CSS files
- Do not use web-only properties or browser-specific logic
- Use proper React Native/Expo primitives like:
  - `View`
  - `Text`
  - `ScrollView`
  - `FlatList`
  - `SectionList`
  - `Image`
  - `Pressable`
  - `TouchableOpacity` only if justified
  - `TextInput`
  - `SafeAreaView` where needed

### 2. Use TypeScript Everywhere

- Use strict TypeScript
- Avoid `any`
- Add proper interfaces, types, and prop definitions
- Use route param typing for navigation

### 3. Build Reusable Components

- Identify repeated UI patterns and extract them into reusable components
- Reuse cards, buttons, headers, inputs, list items, section wrappers, badges, chips, tabs, bottom bars, top bars, empty states, and other repeated blocks
- Do not duplicate the same structure across multiple screens if it can be abstracted cleanly
- Prefer composition over copy-paste

### 4. Keep Clean Architecture

Separate the codebase properly into:

- screens
- reusable UI components
- feature-specific components
- hooks
- services
- constants
- theme
- types
- utils

Do not keep everything inside screen files.

### 5. Styling Must Be Centralized

Create a consistent theme system for:

- colors
- spacing
- typography
- border radius
- shadows
- layout tokens

Rules:

- avoid repeated hardcoded color values across files
- avoid magic numbers wherever possible
- preserve the original design language from the HTML screens
- convert web styling into native-friendly React Native styling
- keep design polished and visually consistent

### 6. Accessibility Is Required

- Add accessibility support to all important interactive elements
- Use `accessibilityLabel` where useful
- Use `accessibilityRole` where appropriate
- Ensure touch targets are usable
- Preserve readable text hierarchy and spacing

### 7. Logic Separation

- Keep render code clean
- Move non-trivial logic into hooks or helpers
- Keep screens focused on orchestration and composition
- Create feature services or placeholders where needed
- Avoid large inline transformations in JSX

### 8. Firebase Must Be Prepared, Not Fully Implemented

This app will use Firebase later, but actual integration will be done afterward.

For now:

- prepare Firebase structure
- create placeholder setup/config files
- create placeholder service files for:
  - auth
  - firestore/database
  - storage if relevant
- add clean TODO comments where real implementation will be added later
- do not add fake business logic just to simulate backend behavior

### 9. Install Required Dependencies

Install all required dependencies needed for the Expo React Native version of the app.

Likely categories include:

- navigation
- safe area handling
- gesture handler
- reanimated
- vector icons
- useful UI helpers if required
- Firebase package setup placeholders if needed
- form/validation packages only if the app actually needs them

Rules:

- install only justified packages
- prefer stable, widely used, well-maintained packages
- avoid unnecessary package bloat
- keep the dependency set production-oriented

### 10. Final Output Must Feel Like a Senior-Level Codebase

Do not generate low-quality auto-converted code.

The final code should feel:

- organized
- maintainable
- reusable
- scalable
- easy to extend
- ready for real app development

---

## Required Folder Structure

Use this structure unless the project already has an equivalent or better structure:

```txt
src/
  app/
    providers/
    navigation/
  features/
    <feature-name>/
      components/
      screens/
      hooks/
      services/
      types/
      constants/
  components/
    ui/
    common/
  services/
    firebase/
  theme/
  utils/
  hooks/
  constants/
  types/
  assets/

  If the app is not clearly feature-grouped yet, infer sensible feature groups from:

the HTML screens
screen names
user flows
mainrequirement.md
Navigation Requirements

Set up a proper React Navigation structure for Expo.

Requirements:

use a scalable navigator structure
create typed route definitions
infer navigation flow from the HTML screens and mainrequirement.md
if the flow is ambiguous, choose a sensible default structure and keep it scalable
support future expansion of the app

Possible navigation patterns may include:

stack navigator
bottom tabs
nested stack + tabs

Choose what best fits the converted app.

Design Conversion Rules

For each HTML screen:

inspect and understand the layout
identify repeated patterns across screens
convert the screen into React Native layout structure
preserve the design intent, visual hierarchy, and component relationships
adapt web layout into native-friendly layouts rather than doing a naive 1:1 translation
preserve consistency in spacing, font sizing, cards, actions, and interaction states
convert icons and imagery appropriately for Expo/React Native

Do not simply replicate HTML nesting if a cleaner native structure is possible.

Asset Handling Rules
organize assets properly
reuse local assets when possible
fix broken or mismatched references
if web-only assets or patterns do not translate directly, replace them with the closest native-compatible version
keep all asset references clean and maintainable
Theme and Styling Expectations

Create a centralized theme setup that includes at minimum:

colors
spacing
typography
radius
shadows

Use this theme consistently throughout the app.

Expected behavior:

no duplicated color systems
no uncontrolled inline style sprawl
no inconsistent text hierarchy
no random spacing differences between screens unless intentionally part of the design
Firebase Preparation Requirements

Prepare the following structure or equivalent:

src/services/firebase/
  config.ts
  auth.service.ts
  firestore.service.ts
  storage.service.ts

Requirements:

keep file naming clean and consistent
add placeholder exports and TODO comments
make future integration simple
do not over-engineer
do not implement fake backend flows unless absolutely necessary for app stability
Dependency Installation Expectations

Install and configure the packages required for a strong Expo React Native app conversion.

At minimum, inspect whether the project needs:

@react-navigation/native
@react-navigation/native-stack
@react-navigation/bottom-tabs if tabs are needed
react-native-screens
react-native-safe-area-context
react-native-gesture-handler
react-native-reanimated
@expo/vector-icons
Firebase SDK setup placeholders if appropriate

Also install any additional package only if strongly justified by the app structure.

After installation:

wire imports correctly
ensure app setup remains runnable
avoid half-configured dependencies
Conversion Execution Plan

You must perform the work in this order:

analyze mainrequirement.md
inspect all HTML files inside html/
identify all screens and shared UI patterns
design the feature grouping and folder structure
create a centralized theme system
set up navigation
convert all screens into React Native
extract reusable components
create service and Firebase placeholder structure
install and configure required dependencies
ensure the Expo app is left in a runnable and maintainable state
Quality Rules

Do not:

skip screens without explanation
leave conversion half-finished
keep HTML/web-specific code in the final app
duplicate components or styling unnecessarily
hardcode repeated colors everywhere
keep giant screen files if they can be broken down cleanly
generate poor-quality prototype code
mix API placeholders, business logic, and presentation in the same file without reason

Do:

refactor repeated patterns
keep files readable
use proper naming
make the codebase easy for a senior engineer to continue from
Assumptions Handling

If there is ambiguity in the HTML or mainrequirement.md:

make a reasonable engineering decision
keep the structure scalable
do not block progress because of uncertainty
note key assumptions briefly in comments or final summary if needed
Final Deliverables

When finished, provide a concise summary that includes:

what screens were converted
what reusable components were created
the folder structure added or updated
the dependencies installed
the Firebase placeholder setup created
any important assumptions made from ambiguous requirements or HTML structure
Final Instruction

This is not a demo conversion.

This should become a real, maintainable, component-driven Expo React Native codebase based on the existing HTML screens and mainrequirement.md.

Prioritize:

reusability
maintainability
consistency
clean architecture
Expo correctness
future Firebase readiness
polished UI conversion
```
