# 📋 Phase 1: Detailed Implementation Plan

## Design System & Reusable Component Library

---

## 📌 Project Overview

| Attribute             | Details                           |
| --------------------- | --------------------------------- |
| **Project**           | ICC Community App - Design System |
| **Framework**         | React Native (Expo) + NativeWind  |
| **Screens Audited**   | 62 TSX files                      |
| **Primary Color**     | `#f2780d` (Orange)                |
| **Font**              | Public Sans                       |
| **Form Library**      | Formik + Yup                      |
| **Animation Library** | Moti                              |

---

## 🎯 Phase 1 Goals

1. ✅ Establish a single source of truth for all design tokens
2. ✅ Create reusable UI components that match existing screens
3. ✅ Build a consistent form system with validation
4. ✅ Implement loading, error, and empty states
5. ✅ Add subtle animations for better UX
6. ✅ Prepare architecture for Phase 2 screen migration

---

## 📊 Audit Summary

### Colors Extracted (Top 15)

| Color           | Hex Code  | Usage Count | Purpose                    |
| --------------- | --------- | ----------- | -------------------------- |
| Primary         | `#f2780d` | 464         | Main brand, buttons, icons |
| Background      | `#f8f7f5` | 57          | Screen backgrounds         |
| Admin Text      | `#46291e` | 73          | Admin theme text           |
| Orange Dark     | `#964900` | 19          | Secondary accent           |
| Text Secondary  | `#504441` | 21          | Muted text                 |
| Border Light    | `#d4c3be` | 27          | Card borders               |
| Surface Alt     | `#f1edea` | 27          | Admin backgrounds          |
| Background Warm | `#fdf9f6` | 14          | Profile pages              |
| Error           | `#ba1a1a` | 2           | Destructive actions        |
| Success         | `#00504b` | 3           | Verified badges            |
| Surface         | `#f7f3f0` | 6           | Alternative cards          |
| Muted BG        | `#f5f5f4` | 2           | Input backgrounds          |
| Border Default  | `#e7e5e4` | 8           | Standard borders           |
| Text Muted      | `#78716c` | 7           | Helper text                |
| Text Disabled   | `#a8a29e` | 3           | Disabled states            |

### Typography Scale

| Token | Size | Tailwind      | Count | Use Case          |
| ----- | ---- | ------------- | ----- | ----------------- |
| 2xs   | 10px | `text-[10px]` | 60    | Bottom nav labels |
| xs    | 12px | `text-xs`     | 236   | Captions, helpers |
| sm    | 14px | `text-sm`     | 180   | Body, labels      |
| base  | 16px | `text-base`   | 10    | Standard body     |
| lg    | 18px | `text-lg`     | 123   | Section headers   |
| xl    | 20px | `text-xl`     | 38    | Page titles       |
| 2xl   | 24px | `text-2xl`    | 34    | Large numbers     |
| 3xl   | 30px | `text-3xl`    | 16    | Hero text         |
| 4xl   | 36px | `text-4xl`    | 3     | Splash            |

### Spacing Scale (Most Used)

| Token | Value | Count | Context              |
| ----- | ----- | ----- | -------------------- |
| p-4   | 16px  | 171   | Card padding         |
| px-4  | 16px  | 186   | Screen padding       |
| py-3  | 12px  | 125   | Button padding       |
| py-2  | 8px   | 58    | Small button padding |
| gap-2 | 8px   | 36    | Icon-text gap        |
| gap-4 | 16px  | 24    | Section gap          |
| mb-4  | 16px  | 87    | Section margin       |
| mt-6  | 24px  | 46    | Large margin         |

### Border Radius

| Token        | Value  | Count | Use Case            |
| ------------ | ------ | ----- | ------------------- |
| rounded-xl   | 12px   | 195   | Cards, buttons      |
| rounded-full | 9999px | 155   | Avatars, badges     |
| rounded-lg   | 8px    | 135   | Inputs, small cards |
| rounded-2xl  | 16px   | 4     | Large modals        |

### Component Sizes

| Component       | Size      | Token     |
| --------------- | --------- | --------- |
| Icon Button SM  | 32×32px   | w-8 h-8   |
| Icon Button MD  | 40×40px   | w-10 h-10 |
| Icon Button LG  | 48×48px   | w-12 h-12 |
| Avatar SM       | 40×40px   | w-10 h-10 |
| Avatar MD       | 56×56px   | w-14 h-14 |
| Avatar LG       | 64×64px   | w-16 h-16 |
| Avatar XL       | 80×80px   | w-20 h-20 |
| Avatar 2XL      | 128×128px | w-32 h-32 |
| Bottom Nav Icon | 20px      | -         |
| Header Icon     | 22px      | -         |

---

## 🗂️ Final Folder Structure

```
src/
│
├── 📁 theme/                          # Design Tokens
│   ├── colors.ts                      # Color palette
│   ├── typography.ts                  # Fonts & text styles
│   ├── spacing.ts                     # Spacing scale
│   ├── radius.ts                      # Border radius
│   ├── shadows.ts                     # Shadow definitions
│   ├── motion.ts                      # Animation tokens
│   ├── layout.ts                      # Layout constants
│   ├── iconSizes.ts                   # Icon size scale
│   ├── ThemeProvider.tsx              # Theme context
│   └── index.ts                       # Barrel export
│
├── 📁 components/
│   │
│   ├── 📁 ui/                         # Atomic Components
│   │   ├── 📁 Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   ├── Button.styles.ts
│   │   │   └── index.ts
│   │   ├── 📁 IconButton/
│   │   ├── 📁 Text/
│   │   ├── 📁 Badge/
│   │   ├── 📁 Avatar/
│   │   ├── 📁 Card/
│   │   ├── 📁 Divider/
│   │   ├── 📁 Icon/
│   │   └── index.ts
│   │
│   ├── 📁 forms/                      # Form Components
│   │   ├── 📁 TextField/
│   │   │   ├── TextField.tsx
│   │   │   ├── TextField.types.ts
│   │   │   └── index.ts
│   │   ├── 📁 PhoneInput/
│   │   ├── 📁 OTPInput/
│   │   ├── 📁 SelectField/
│   │   ├── 📁 DateField/
│   │   ├── 📁 RadioGroup/
│   │   ├── 📁 Checkbox/
│   │   ├── 📁 AmountSelector/
│   │   ├── 📁 SegmentedControl/
│   │   ├── 📁 FileUpload/
│   │   ├── 📁 SearchInput/
│   │   ├── 📁 FormSection/
│   │   ├── 📁 SubmitButton/
│   │   ├── 📁 validation/
│   │   │   ├── schemas.ts
│   │   │   ├── helpers.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── 📁 layout/                     # Layout Components
│   │   ├── 📁 UserScreen/
│   │   │   ├── UserScreen.tsx
│   │   │   ├── UserScreen.types.ts
│   │   │   └── index.ts
│   │   ├── 📁 UserHeader/
│   │   │   ├── UserHeader.tsx
│   │   │   ├── UserHeader.types.ts
│   │   │   ├── HeaderBackTitle.tsx
│   │   │   ├── HeaderCentered.tsx
│   │   │   ├── HeaderWithActions.tsx
│   │   │   └── index.ts
│   │   ├── 📁 UserBottomBar/
│   │   ├── 📁 ScreenSection/
│   │   ├── 📁 SectionCard/
│   │   ├── 📁 ProgressStepper/
│   │   ├── 📁 KeyboardAwareView/
│   │   └── index.ts
│   │
│   ├── 📁 feedback/                   # Feedback Components
│   │   ├── 📁 Skeleton/
│   │   │   ├── SkeletonBox.tsx
│   │   │   ├── SkeletonCircle.tsx
│   │   │   ├── SkeletonText.tsx
│   │   │   ├── SkeletonCard.tsx
│   │   │   ├── SkeletonList.tsx
│   │   │   ├── SkeletonForm.tsx
│   │   │   └── index.ts
│   │   ├── 📁 EmptyState/
│   │   ├── 📁 ErrorState/
│   │   ├── 📁 LoadingOverlay/
│   │   ├── 📁 Toast/
│   │   └── index.ts
│   │
│   ├── 📁 lists/                      # List Components
│   │   ├── 📁 ListItem/
│   │   ├── 📁 MemberListItem/
│   │   ├── 📁 NotificationItem/
│   │   ├── 📁 TransactionItem/
│   │   ├── 📁 FilterChips/
│   │   └── index.ts
│   │
│   ├── 📁 motion/                     # Animation Wrappers
│   │   ├── FadeIn.tsx
│   │   ├── SlideIn.tsx
│   │   ├── SlideUp.tsx
│   │   ├── ScaleIn.tsx
│   │   ├── StaggeredList.tsx
│   │   ├── AnimatedPressable.tsx
│   │   └── index.ts
│   │
│   └── index.ts                       # Master export
│
├── 📁 types/                          # TypeScript Types
│   ├── theme.types.ts
│   ├── component.types.ts
│   ├── form.types.ts
│   ├── navigation.types.ts
│   ├── user.types.ts
│   ├── donation.types.ts
│   ├── event.types.ts
│   ├── family.types.ts
│   └── index.ts
│
├── 📁 services/                       # API & Services
│   ├── 📁 api/
│   │   ├── client.ts
│   │   ├── endpoints.ts
│   │   ├── interceptors.ts
│   │   └── index.ts
│   ├── auth.service.ts
│   ├── storage.service.ts
│   ├── notification.service.ts
│   └── index.ts
│
├── 📁 constants/                      # App Constants
│   ├── routes.ts
│   ├── apiConfig.ts
│   ├── appConfig.ts
│   ├── storageKeys.ts
│   └── index.ts
│
├── 📁 hooks/                          # Custom Hooks
│   ├── useTheme.ts
│   ├── useKeyboard.ts
│   ├── useForm.ts
│   ├── useAnimation.ts
│   ├── useDebounce.ts
│   └── index.ts
│
├── 📁 utils/                          # Utilities
│   ├── formatters.ts
│   ├── validators.ts
│   ├── helpers.ts
│   └── index.ts
│
└── 📁 notifications/                  # Notification System
    ├── notificationService.ts
    ├── notificationTypes.ts
    ├── notificationHelpers.ts
    └── index.ts
```

---

## 📅 Implementation Timeline

### Week 1: Foundation

#### Day 1-2: Theme Setup

| Task                 | File                      | Priority  | Est. Hours |
| -------------------- | ------------------------- | --------- | ---------- |
| Create colors.ts     | `theme/colors.ts`         | 🔴 High   | 2          |
| Create typography.ts | `theme/typography.ts`     | 🔴 High   | 2          |
| Create spacing.ts    | `theme/spacing.ts`        | 🔴 High   | 1          |
| Create radius.ts     | `theme/radius.ts`         | 🔴 High   | 1          |
| Create shadows.ts    | `theme/shadows.ts`        | 🟡 Medium | 1          |
| Create motion.ts     | `theme/motion.ts`         | 🟡 Medium | 1          |
| Create layout.ts     | `theme/layout.ts`         | 🟡 Medium | 1          |
| Create iconSizes.ts  | `theme/iconSizes.ts`      | 🟡 Medium | 0.5        |
| Create ThemeProvider | `theme/ThemeProvider.tsx` | 🔴 High   | 2          |
| Create index barrel  | `theme/index.ts`          | 🟢 Low    | 0.5        |

#### Day 3: Font Setup

| Task                       | File                | Priority  | Est. Hours |
| -------------------------- | ------------------- | --------- | ---------- |
| Download Public Sans fonts | `assets/fonts/`     | 🔴 High   | 1          |
| Configure expo-font        | `App.tsx`           | 🔴 High   | 2          |
| Test font loading          | -                   | 🔴 High   | 1          |
| Create font loading hook   | `hooks/useFonts.ts` | 🟡 Medium | 1          |

#### Day 4-5: NativeWind Config

| Task                      | File                 | Priority  | Est. Hours |
| ------------------------- | -------------------- | --------- | ---------- |
| Update tailwind.config.js | `tailwind.config.js` | 🔴 High   | 3          |
| Add custom colors         | -                    | 🔴 High   | 1          |
| Add custom fonts          | -                    | 🔴 High   | 1          |
| Add custom spacing        | -                    | 🟡 Medium | 1          |
| Test configuration        | -                    | 🔴 High   | 2          |

---

### Week 2: Core UI Components

#### Day 1-2: Button System

| Task                                                | File                                   | Priority | Est. Hours |
| --------------------------------------------------- | -------------------------------------- | -------- | ---------- |
| Button types                                        | `components/ui/Button/Button.types.ts` | 🔴 High  | 1          |
| Button component                                    | `components/ui/Button/Button.tsx`      | 🔴 High  | 4          |
| Button variants (primary, secondary, ghost, danger) | -                                      | 🔴 High  | 2          |
| Button sizes (sm, md, lg)                           | -                                      | 🔴 High  | 1          |
| Button states (loading, disabled)                   | -                                      | 🔴 High  | 2          |
| IconButton component                                | `components/ui/IconButton/`            | 🔴 High  | 2          |

#### Day 3: Badge & Avatar

| Task                                              | File                                   | Priority  | Est. Hours |
| ------------------------------------------------- | -------------------------------------- | --------- | ---------- |
| Badge types                                       | `components/ui/Badge/Badge.types.ts`   | 🟡 Medium | 0.5        |
| Badge component                                   | `components/ui/Badge/Badge.tsx`        | 🟡 Medium | 2          |
| Badge variants (default, success, error, warning) | -                                      | 🟡 Medium | 1          |
| Avatar types                                      | `components/ui/Avatar/Avatar.types.ts` | 🔴 High   | 0.5        |
| Avatar component                                  | `components/ui/Avatar/Avatar.tsx`      | 🔴 High   | 2          |
| Avatar sizes (xs, sm, md, lg, xl, 2xl)            | -                                      | 🔴 High   | 1          |

#### Day 4: Card System

| Task                                                        | File                               | Priority  | Est. Hours |
| ----------------------------------------------------------- | ---------------------------------- | --------- | ---------- |
| Card types                                                  | `components/ui/Card/Card.types.ts` | 🔴 High   | 1          |
| Card component                                              | `components/ui/Card/Card.tsx`      | 🔴 High   | 3          |
| Card variants (default, elevated, outlined, muted, primary) | -                                  | 🔴 High   | 2          |
| CardHeader subcomponent                                     | -                                  | 🟡 Medium | 1          |
| CardContent subcomponent                                    | -                                  | 🟡 Medium | 1          |
| CardFooter subcomponent                                     | -                                  | 🟡 Medium | 1          |

#### Day 5: Typography & Utilities

| Task                                        | File                          | Priority  | Est. Hours |
| ------------------------------------------- | ----------------------------- | --------- | ---------- |
| Text component                              | `components/ui/Text/Text.tsx` | 🔴 High   | 2          |
| Text variants (h1-h5, body, caption, label) | -                             | 🔴 High   | 2          |
| Divider component                           | `components/ui/Divider/`      | 🟢 Low    | 1          |
| Icon wrapper component                      | `components/ui/Icon/`         | 🟡 Medium | 1          |

---

### Week 3: Layout Shell

#### Day 1-2: Screen Wrapper

| Task                       | File                                               | Priority | Est. Hours |
| -------------------------- | -------------------------------------------------- | -------- | ---------- |
| UserScreen types           | `components/layout/UserScreen/UserScreen.types.ts` | 🔴 High  | 1          |
| UserScreen component       | `components/layout/UserScreen/UserScreen.tsx`      | 🔴 High  | 4          |
| SafeAreaView integration   | -                                                  | 🔴 High  | 1          |
| StatusBar configuration    | -                                                  | 🔴 High  | 1          |
| Keyboard avoiding behavior | -                                                  | 🔴 High  | 2          |

#### Day 2-3: Header System

| Task                      | File                                                 | Priority  | Est. Hours |
| ------------------------- | ---------------------------------------------------- | --------- | ---------- |
| UserHeader types          | `components/layout/UserHeader/UserHeader.types.ts`   | 🔴 High   | 1          |
| HeaderBackTitle variant   | `components/layout/UserHeader/HeaderBackTitle.tsx`   | 🔴 High   | 2          |
| HeaderCentered variant    | `components/layout/UserHeader/HeaderCentered.tsx`    | 🔴 High   | 2          |
| HeaderWithActions variant | `components/layout/UserHeader/HeaderWithActions.tsx` | 🔴 High   | 2          |
| HeaderLogoTitle variant   | `components/layout/UserHeader/HeaderLogoTitle.tsx`   | 🟡 Medium | 2          |
| UserHeader factory        | `components/layout/UserHeader/UserHeader.tsx`        | 🔴 High   | 1          |

#### Day 4: Bottom Navigation

| Task                    | File                                                     | Priority  | Est. Hours |
| ----------------------- | -------------------------------------------------------- | --------- | ---------- |
| UserBottomBar types     | `components/layout/UserBottomBar/UserBottomBar.types.ts` | 🔴 High   | 1          |
| UserBottomBar component | `components/layout/UserBottomBar/UserBottomBar.tsx`      | 🔴 High   | 4          |
| Tab item component      | -                                                        | 🔴 High   | 1          |
| Active/inactive states  | -                                                        | 🔴 High   | 1          |
| Badge on tab support    | -                                                        | 🟡 Medium | 1          |

#### Day 5: Section Components

| Task                      | File                                   | Priority  | Est. Hours |
| ------------------------- | -------------------------------------- | --------- | ---------- |
| ScreenSection component   | `components/layout/ScreenSection/`     | 🟡 Medium | 2          |
| SectionCard component     | `components/layout/SectionCard/`       | 🟡 Medium | 2          |
| ProgressStepper component | `components/layout/ProgressStepper/`   | 🔴 High   | 3          |
| KeyboardAwareView wrapper | `components/layout/KeyboardAwareView/` | 🔴 High   | 2          |

---

### Week 4: Form System

#### Day 1-2: Text Inputs

| Task                  | File                            | Priority  | Est. Hours |
| --------------------- | ------------------------------- | --------- | ---------- |
| Base field types      | `components/forms/types.ts`     | 🔴 High   | 2          |
| TextField component   | `components/forms/TextField/`   | 🔴 High   | 4          |
| TextField with Formik | -                               | 🔴 High   | 2          |
| PhoneInput component  | `components/forms/PhoneInput/`  | 🔴 High   | 3          |
| OTPInput component    | `components/forms/OTPInput/`    | 🔴 High   | 4          |
| SearchInput component | `components/forms/SearchInput/` | 🟡 Medium | 2          |

#### Day 3: Selection Inputs

| Task                  | File                            | Priority | Est. Hours |
| --------------------- | ------------------------------- | -------- | ---------- |
| SelectField component | `components/forms/SelectField/` | 🔴 High  | 4          |
| DateField component   | `components/forms/DateField/`   | 🔴 High  | 3          |
| RadioGroup component  | `components/forms/RadioGroup/`  | 🔴 High  | 3          |
| Checkbox component    | `components/forms/Checkbox/`    | 🔴 High  | 2          |

#### Day 4: Special Inputs

| Task                       | File                                 | Priority | Est. Hours |
| -------------------------- | ------------------------------------ | -------- | ---------- |
| AmountSelector component   | `components/forms/AmountSelector/`   | 🔴 High  | 3          |
| SegmentedControl component | `components/forms/SegmentedControl/` | 🔴 High  | 3          |
| FileUpload component       | `components/forms/FileUpload/`       | 🔴 High  | 4          |

#### Day 5: Form Utilities

| Task                   | File                                     | Priority  | Est. Hours |
| ---------------------- | ---------------------------------------- | --------- | ---------- |
| FormSection component  | `components/forms/FormSection/`          | 🟡 Medium | 2          |
| SubmitButton component | `components/forms/SubmitButton/`         | 🔴 High   | 2          |
| Yup validation schemas | `components/forms/validation/schemas.ts` | 🔴 High   | 3          |
| Validation helpers     | `components/forms/validation/helpers.ts` | 🟡 Medium | 2          |

---

### Week 5: Feedback & Animation

#### Day 1-2: Skeleton System

| Task                     | File                                              | Priority  | Est. Hours |
| ------------------------ | ------------------------------------------------- | --------- | ---------- |
| SkeletonBox component    | `components/feedback/Skeleton/SkeletonBox.tsx`    | 🔴 High   | 2          |
| SkeletonCircle component | `components/feedback/Skeleton/SkeletonCircle.tsx` | 🔴 High   | 1          |
| SkeletonText component   | `components/feedback/Skeleton/SkeletonText.tsx`   | 🔴 High   | 1          |
| SkeletonCard component   | `components/feedback/Skeleton/SkeletonCard.tsx`   | 🔴 High   | 2          |
| SkeletonList component   | `components/feedback/Skeleton/SkeletonList.tsx`   | 🔴 High   | 2          |
| SkeletonForm component   | `components/feedback/Skeleton/SkeletonForm.tsx`   | 🟡 Medium | 2          |
| Shimmer animation        | -                                                 | 🔴 High   | 2          |

#### Day 3: State Components

| Task                     | File                                  | Priority | Est. Hours |
| ------------------------ | ------------------------------------- | -------- | ---------- |
| EmptyState component     | `components/feedback/EmptyState/`     | 🔴 High  | 3          |
| ErrorState component     | `components/feedback/ErrorState/`     | 🔴 High  | 3          |
| LoadingOverlay component | `components/feedback/LoadingOverlay/` | 🔴 High  | 2          |

#### Day 4: Toast/Notification

| Task                                           | File                                          | Priority  | Est. Hours |
| ---------------------------------------------- | --------------------------------------------- | --------- | ---------- |
| Toast component                                | `components/feedback/Toast/Toast.tsx`         | 🟡 Medium | 3          |
| Toast variants (success, error, warning, info) | -                                             | 🟡 Medium | 2          |
| Toast context/provider                         | `components/feedback/Toast/ToastProvider.tsx` | 🟡 Medium | 2          |
| useToast hook                                  | `hooks/useToast.ts`                           | 🟡 Medium | 1          |

#### Day 5: Animation Wrappers

| Task                        | File                                      | Priority  | Est. Hours |
| --------------------------- | ----------------------------------------- | --------- | ---------- |
| FadeIn component            | `components/motion/FadeIn.tsx`            | 🔴 High   | 2          |
| SlideIn component           | `components/motion/SlideIn.tsx`           | 🔴 High   | 2          |
| SlideUp component           | `components/motion/SlideUp.tsx`           | 🔴 High   | 1          |
| ScaleIn component           | `components/motion/ScaleIn.tsx`           | 🟡 Medium | 1          |
| StaggeredList component     | `components/motion/StaggeredList.tsx`     | 🔴 High   | 3          |
| AnimatedPressable component | `components/motion/AnimatedPressable.tsx` | 🔴 High   | 2          |

---

### Week 6: Testing & Documentation

#### Day 1-2: Types & Hooks

| Task              | File                       | Priority  | Est. Hours |
| ----------------- | -------------------------- | --------- | ---------- |
| Theme types       | `types/theme.types.ts`     | 🔴 High   | 2          |
| Component types   | `types/component.types.ts` | 🔴 High   | 2          |
| Form types        | `types/form.types.ts`      | 🔴 High   | 2          |
| useTheme hook     | `hooks/useTheme.ts`        | 🔴 High   | 2          |
| useKeyboard hook  | `hooks/useKeyboard.ts`     | 🟡 Medium | 2          |
| useAnimation hook | `hooks/useAnimation.ts`    | 🟡 Medium | 2          |

#### Day 3: Services & Constants

| Task             | File                       | Priority  | Est. Hours |
| ---------------- | -------------------------- | --------- | ---------- |
| API client setup | `services/api/client.ts`   | 🟡 Medium | 3          |
| Route constants  | `constants/routes.ts`      | 🔴 High   | 1          |
| App config       | `constants/appConfig.ts`   | 🟡 Medium | 1          |
| Storage keys     | `constants/storageKeys.ts` | 🟡 Medium | 1          |

#### Day 4-5: Testing & Docs

| Task                    | File                 | Priority  | Est. Hours |
| ----------------------- | -------------------- | --------- | ---------- |
| Component unit tests    | `__tests__/`         | 🔴 High   | 8          |
| Create usage examples   | `docs/examples/`     | 🟡 Medium | 4          |
| Migration guide         | `docs/MIGRATION.md`  | 🔴 High   | 3          |
| Component documentation | `docs/COMPONENTS.md` | 🟡 Medium | 4          |

---

## 📝 Component Specifications

### 1. Button Component

```typescript
// Button.types.ts
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  children: React.ReactNode;
}
```

**Visual Specifications:**

| Variant   | Background    | Text      | Border    |
| --------- | ------------- | --------- | --------- |
| primary   | `#f2780d`     | `#ffffff` | none      |
| secondary | `transparent` | `#f2780d` | `#f2780d` |
| ghost     | `transparent` | `#f2780d` | none      |
| danger    | `#ba1a1a`     | `#ffffff` | none      |
| outline   | `transparent` | `#504441` | `#e7e5e4` |

| Size | Height | Padding X | Font Size | Radius |
| ---- | ------ | --------- | --------- | ------ |
| sm   | 32px   | 12px      | 12px      | 8px    |
| md   | 40px   | 16px      | 14px      | 12px   |
| lg   | 48px   | 20px      | 16px      | 12px   |

---

### 2. TextField Component

```typescript
// TextField.types.ts
export interface TextFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  maxLength?: number;
}
```

**Visual Specifications:**

| State    | Background | Border                 | Label Color |
| -------- | ---------- | ---------------------- | ----------- |
| default  | `#f8f7f5`  | `rgba(242,120,13,0.2)` | `#78716c`   |
| focused  | `#ffffff`  | `#f2780d`              | `#f2780d`   |
| error    | `#ffedea`  | `#ba1a1a`              | `#ba1a1a`   |
| disabled | `#f5f5f4`  | `#e7e5e4`              | `#a8a29e`   |

| Property      | Value              |
| ------------- | ------------------ |
| Height        | 48px (single line) |
| Padding X     | 12px               |
| Padding Y     | 12px               |
| Border Radius | 12px               |
| Font Size     | 14px               |
| Label Size    | 12px               |
| Helper Size   | 12px               |

---

### 3. UserHeader Component

```typescript
// UserHeader.types.ts
export type HeaderVariant =
  | "back-title"
  | "back-title-action"
  | "centered-title"
  | "logo-title-actions"
  | "title-subtitle";

export interface UserHeaderProps {
  variant: HeaderVariant;
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  showBack?: boolean;
  rightActions?: React.ReactNode[];
  logoComponent?: React.ReactNode;
  transparent?: boolean;
}
```

**Visual Specifications:**

| Property         | Value                    |
| ---------------- | ------------------------ |
| Height           | 56px                     |
| Padding X        | 16px                     |
| Background       | `#f8f7f5` or transparent |
| Border Bottom    | `rgba(242,120,13,0.1)`   |
| Title Size       | 18px                     |
| Title Weight     | Bold                     |
| Icon Size        | 22px                     |
| Icon Button Size | 40px                     |

---

### 4. UserBottomBar Component

```typescript
// UserBottomBar.types.ts
export interface BottomBarItem {
  key: string;
  icon: IconName;
  label: string;
  route: string;
  badge?: number;
}

export interface UserBottomBarProps {
  items: BottomBarItem[];
  activeKey: string;
  onItemPress: (item: BottomBarItem) => void;
}
```

**Visual Specifications:**

| Property       | Value                  |
| -------------- | ---------------------- |
| Height         | 56px                   |
| Background     | `#ffffff`              |
| Border Top     | `rgba(242,120,13,0.1)` |
| Icon Size      | 20px                   |
| Label Size     | 10px                   |
| Active Color   | `#f2780d`              |
| Inactive Color | `#9ca3af`              |

---

### 5. Card Component

```typescript
// Card.types.ts
export type CardVariant =
  | "default"
  | "elevated"
  | "outlined"
  | "muted"
  | "primary";

export interface CardProps {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
  onPress?: () => void;
}
```

**Visual Specifications:**

| Variant  | Background    | Border                 | Shadow |
| -------- | ------------- | ---------------------- | ------ |
| default  | `#ffffff`     | `rgba(242,120,13,0.1)` | none   |
| elevated | `#ffffff`     | none                   | sm     |
| outlined | `transparent` | `#e7e5e4`              | none   |
| muted    | `#f8f7f5`     | none                   | none   |
| primary  | `#f2780d`     | none                   | none   |

| Padding | Value |
| ------- | ----- |
| none    | 0px   |
| sm      | 12px  |
| md      | 16px  |
| lg      | 20px  |

---

### 6. Skeleton Component

```typescript
// Skeleton.types.ts
export interface SkeletonBoxProps {
  width?: number | string;
  height?: number | string;
  radius?: number;
}

export interface SkeletonTextProps {
  lines?: number;
  lastLineWidth?: string;
}

export interface SkeletonCardProps {
  hasImage?: boolean;
  hasAction?: boolean;
  lines?: number;
}
```

**Visual Specifications:**

| Property           | Value         |
| ------------------ | ------------- |
| Base Color         | `#e7e5e4`     |
| Shimmer Color      | `#f5f5f4`     |
| Animation Duration | 1500ms        |
| Border Radius      | 8px (default) |

---

### 7. EmptyState Component

```typescript
// EmptyState.types.ts
export interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  size?: "sm" | "md" | "lg";
}
```

**Visual Specifications:**

| Size | Icon Size | Title Size | Padding |
| ---- | --------- | ---------- | ------- |
| sm   | 40px      | 16px       | 16px    |
| md   | 56px      | 18px       | 24px    |
| lg   | 72px      | 20px       | 32px    |

---

### 8. Animation Wrappers

```typescript
// FadeIn.tsx
export interface FadeInProps {
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}

// SlideIn.tsx
export interface SlideInProps {
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  duration?: number;
  distance?: number;
  children: React.ReactNode;
}

// StaggeredList.tsx
export interface StaggeredListProps {
  staggerDelay?: number;
  children: React.ReactNode[];
}
```

---

## 📦 Dependencies

### Required Packages

```json
{
  "dependencies": {
    // Form Management
    "formik": "^2.4.5",
    "yup": "^1.3.2",

    // Animation
    "moti": "^0.28.0",
    "react-native-reanimated": "~3.10.0",

    // Fonts
    "@expo-google-fonts/public-sans": "^0.2.3",
    "expo-font": "~12.0.0",

    // Layout & Navigation
    "react-native-safe-area-context": "^4.8.2",
    "react-native-screens": "~3.29.0",

    // Keyboard
    "react-native-keyboard-aware-scroll-view": "^0.9.5",

    // Icons (already have)
    "@expo/vector-icons": "^14.0.0",

    // Date Picker
    "@react-native-community/datetimepicker": "^7.6.1",

    // Image Picker (for file upload)
    "expo-image-picker": "~15.0.0",
    "expo-document-picker": "~12.0.0"
  }
}
```

### Install Commands

```bash
# Core dependencies
npx expo install formik yup moti react-native-reanimated

# Fonts
npx expo install @expo-google-fonts/public-sans expo-font

# Layout
npx expo install react-native-safe-area-context react-native-screens

# Keyboard handling
npm install react-native-keyboard-aware-scroll-view

# Date picker
npx expo install @react-native-community/datetimepicker

# File pickers
npx expo install expo-image-picker expo-document-picker
```

---

## ✅ Validation Schemas (Yup)

```typescript
// validation/schemas.ts
import * as Yup from "yup";

// Individual field schemas
export const fieldSchemas = {
  // Mobile (India - 10 digits starting with 6-9)
  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile number")
    .required("Mobile number is required"),

  // OTP (6 digits)
  otp: Yup.string()
    .matches(/^\d{6}$/, "Enter 6-digit OTP")
    .required("OTP is required"),

  // Name (2-50 characters)
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Name is required"),

  // Email
  email: Yup.string()
    .email("Enter valid email address")
    .required("Email is required"),

  // Optional Email
  emailOptional: Yup.string().email("Enter valid email address"),

  // Amount (positive number, min 1)
  amount: Yup.number()
    .positive("Amount must be positive")
    .min(1, "Minimum amount is ₹1")
    .required("Amount is required"),

  // Required select
  requiredSelect: Yup.string().required("Please select an option"),

  // Pincode (India - 6 digits)
  pincode: Yup.string()
    .matches(/^\d{6}$/, "Enter valid 6-digit pincode")
    .required("Pincode is required"),

  // Date (required)
  date: Yup.date().required("Date is required"),

  // Date (optional)
  dateOptional: Yup.date().nullable(),

  // Checkbox consent
  consent: Yup.boolean().oneOf([true], "You must accept the terms"),

  // Aadhaar (12 digits)
  aadhaar: Yup.string()
    .matches(/^\d{12}$/, "Enter valid 12-digit Aadhaar number")
    .required("Aadhaar number is required"),

  // PAN (AAAAA9999A format)
  pan: Yup.string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Enter valid PAN number")
    .required("PAN number is required"),

  // Address
  address: Yup.string()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must be less than 200 characters")
    .required("Address is required"),

  // File (for document upload)
  file: Yup.mixed().required("Please upload a file"),

  // Optional file
  fileOptional: Yup.mixed().nullable(),
};

// Complete form schemas
export const formSchemas = {
  // Registration Step 1
  registrationOTP: Yup.object({
    mobile: fieldSchemas.mobile,
    otp: fieldSchemas.otp,
  }),

  // Registration Step 2 - Profile
  profile: Yup.object({
    fullName: fieldSchemas.name,
    fatherName: fieldSchemas.name,
    gender: fieldSchemas.requiredSelect,
    dob: fieldSchemas.date,
    address: fieldSchemas.address,
    city: Yup.string().required("City is required"),
    pincode: fieldSchemas.pincode,
    occupation: Yup.string().required("Occupation is required"),
  }),

  // Registration Step 3 - KYC
  kyc: Yup.object({
    aadhaarDocument: fieldSchemas.file,
    casteCertificate: fieldSchemas.fileOptional,
    profilePhoto: fieldSchemas.file,
    consent: fieldSchemas.consent,
  }),

  // Donation form
  donation: Yup.object({
    donorType: fieldSchemas.requiredSelect,
    donorName: fieldSchemas.name,
    relation: Yup.string().when("donorType", {
      is: "behalf",
      then: (schema) => schema.required("Relation is required"),
    }),
    amount: fieldSchemas.amount,
    message: Yup.string().max(200, "Message must be less than 200 characters"),
  }),

  // Manual donation (admin)
  manualDonation: Yup.object({
    memberSearch: Yup.string(),
    manualName: Yup.string().when("memberSearch", {
      is: (val: string) => !val || val.length === 0,
      then: (schema) => schema.required("Donor name is required"),
    }),
    amount: fieldSchemas.amount,
    date: fieldSchemas.date,
    paymentMode: fieldSchemas.requiredSelect,
    reference: Yup.string(),
    proof: fieldSchemas.fileOptional,
  }),

  // Add family member
  familyMember: Yup.object({
    fullName: fieldSchemas.name,
    relation: fieldSchemas.requiredSelect,
    gender: fieldSchemas.requiredSelect,
    dob: fieldSchemas.date,
    education: Yup.string(),
    occupation: Yup.string(),
  }),

  // Event registration
  eventRegistration: Yup.object({
    addons: Yup.array().of(
      Yup.object({
        id: Yup.string(),
        quantity: Yup.number().min(0),
      }),
    ),
    consent: fieldSchemas.consent,
  }),
};
```

---

## 🎯 Acceptance Criteria

### Theme Tokens

- [ ] All color tokens match audit findings
- [ ] Typography scale renders correctly
- [ ] Spacing scale is consistent
- [ ] Border radius matches existing screens
- [ ] Public Sans font loads on app start

### Core Components

- [ ] Button renders all 5 variants correctly
- [ ] Button shows loading spinner when loading=true
- [ ] IconButton renders at all 3 sizes
- [ ] Card renders all 5 variants
- [ ] Badge shows correct colors for each variant
- [ ] Avatar loads images and shows fallback

### Layout Shell

- [ ] UserScreen wraps content with SafeAreaView
- [ ] UserScreen handles keyboard avoiding
- [ ] UserHeader renders all 5 variants
- [ ] UserBottomBar highlights active tab
- [ ] ProgressStepper shows current step

### Form System

- [ ] TextField integrates with Formik
- [ ] TextField shows error state from Yup
- [ ] OTPInput auto-advances on digit entry
- [ ] PhoneInput shows country code
- [ ] SelectField opens picker modal
- [ ] AmountSelector highlights selected chip
- [ ] FileUpload shows selected file preview

### Feedback Components

- [ ] Skeleton shows shimmer animation
- [ ] EmptyState renders icon, title, action
- [ ] ErrorState shows retry button
- [ ] Toast appears and auto-dismisses
- [ ] LoadingOverlay blocks interaction

### Animation

- [ ] FadeIn animates opacity
- [ ] SlideIn animates from correct direction
- [ ] StaggeredList staggers children
- [ ] AnimatedPressable scales on press

### Visual Parity

- [ ] Donation screen components match HTML
- [ ] Dashboard/ID Card components match HTML
- [ ] Registration flow components match HTML

---

## 🔄 Migration Strategy (for Phase 2)

### Screen Migration Order

1. **Donation Management** - Uses most form components
2. **Dashboard & ID Card** - Uses card system extensively
3. **Registration & KYC** - Uses stepper, forms, file upload
4. **Family Management** - Uses list items, forms
5. **Member Directory** - Uses search, lists, filters
6. **Event Details** - Uses cards, lists, CTAs
7. **Notifications** - Uses list items, badges
8. **My Profile** - Uses sections, display cards

### Migration Checklist per Screen

- [ ] Import design system components
- [ ] Replace hardcoded colors with tokens
- [ ] Replace hardcoded spacing with tokens
- [ ] Replace inline styles with component props
- [ ] Add Formik to forms
- [ ] Add Yup validation
- [ ] Add loading skeletons
- [ ] Add empty states
- [ ] Add error states
- [ ] Add animations
- [ ] Test keyboard handling
- [ ] Test on iOS and Android

---

## 📚 Documentation Deliverables

1. **COMPONENTS.md** - Full component API documentation
2. **TOKENS.md** - Design token reference
3. **FORMS.md** - Form system usage guide
4. **MIGRATION.md** - Step-by-step migration guide
5. **EXAMPLES.md** - Code examples for common patterns

---

## 🚫 Out of Scope (Phase 1)

- Admin-specific components and theming
- Dark mode support
- Internationalization (i18n)
- Accessibility (a11y) audit
- Performance optimization
- E2E testing
- CI/CD setup
- Storybook integration

These will be addressed in Phase 2 or later phases.

---

## 📞 Questions for Stakeholder

1. Should we support dark mode in the future? (affects token structure)
2. Are there any additional fonts needed beyond Public Sans?
3. What is the minimum Android/iOS version to support?
4. Should Toast notifications be persistent or auto-dismiss?
5. What is the preferred date format (DD/MM/YYYY or other)?
6. Should file upload support camera capture directly?
7. Are there any specific accessibility requirements?

---

_Document Version: 1.0_
_Last Updated: April 7, 2026_
_Author: Design System Team_
