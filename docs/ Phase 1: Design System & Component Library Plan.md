# 🎨 Phase 1: Design System & Component Library Plan

## Executive Summary

Based on a comprehensive audit of **62 screens** from the uploaded codebase, this document outlines a complete design system strategy for the React Native (Expo + NativeWind) application.

---

## 📊 Audit Findings

### Color Usage Analysis

| Color     | Usage Count | Purpose                                       |
| --------- | ----------- | --------------------------------------------- |
| `#f2780d` | 464 uses    | **Primary Orange** - buttons, icons, accents  |
| `#f8f7f5` | 57 uses     | **Background** - main screen background       |
| `#46291e` | 73 uses     | **Text Dark / Admin** - headings, admin theme |
| `#964900` | 19 uses     | **Orange Dark** - accent, secondary orange    |
| `#504441` | 21 uses     | **Text Secondary** - muted text               |
| `#d4c3be` | 27 uses     | **Border Light** - card borders               |
| `#f1edea` | 27 uses     | **Surface Alt** - admin backgrounds           |
| `#fdf9f6` | 14 uses     | **Background Warm** - profile pages           |
| `#ba1a1a` | 2 uses      | **Error/Danger** - destructive actions        |
| `#00504b` | 3 uses      | **Success/Verified** - badges                 |

### Typography Analysis

| Size | Tailwind Class | Usage Count | Purpose               |
| ---- | -------------- | ----------- | --------------------- |
| 10px | `text-[10px]`  | 60          | Bottom nav labels     |
| 12px | `text-xs`      | 236         | Captions, helper text |
| 14px | `text-sm`      | 180         | Body text, labels     |
| 16px | `text-base`    | 10          | Standard body         |
| 18px | `text-lg`      | 123         | Section headers       |
| 20px | `text-xl`      | 38          | Page titles           |
| 24px | `text-2xl`     | 34          | Large numbers         |
| 30px | `text-3xl`     | 16          | Hero text             |
| 36px | `text-4xl`     | 3           | Splash/Hero           |

### Spacing Analysis (Most Used)

| Token   | Value | Usage Count |
| ------- | ----- | ----------- |
| `px-4`  | 16px  | 186         |
| `p-4`   | 16px  | 171         |
| `py-3`  | 12px  | 125         |
| `mb-4`  | 16px  | 87          |
| `p-3`   | 12px  | 39          |
| `gap-2` | 8px   | 36          |
| `gap-4` | 16px  | 24          |

### Border Radius Analysis

| Token          | Usage Count | Purpose                       |
| -------------- | ----------- | ----------------------------- |
| `rounded-xl`   | 195         | Cards, buttons, inputs        |
| `rounded-full` | 155         | Avatars, icon buttons, badges |
| `rounded-lg`   | 135         | Secondary cards, form fields  |
| `rounded-2xl`  | 4           | Large cards                   |

### Component Size Standards

| Component            | Width         | Height        |
| -------------------- | ------------- | ------------- |
| Icon Button (Small)  | 32px (`w-8`)  | 32px (`h-8`)  |
| Icon Button (Medium) | 40px (`w-10`) | 40px (`h-10`) |
| Icon Button (Large)  | 48px (`w-12`) | 48px (`h-12`) |
| Avatar (Small)       | 40px          | 40px          |
| Avatar (Medium)      | 56px (`w-14`) | 56px (`h-14`) |
| Avatar (Large)       | 64px (`w-16`) | 64px (`h-16`) |
| Bottom Nav Icon      | 20-22px       | -             |

---

## 🗂️ Proposed Folder Structure

```
src/
├── theme/
│   ├── colors.ts              # Color tokens
│   ├── typography.ts          # Font sizes, weights, families
│   ├── spacing.ts             # Spacing scale
│   ├── radius.ts              # Border radius tokens
│   ├── shadows.ts             # Shadow definitions
│   ├── motion.ts              # Animation constants (moti)
│   ├── layout.ts              # Screen/container constants
│   ├── iconSizes.ts           # Icon size scale
│   └── index.ts               # Theme export & ThemeProvider
│
├── components/
│   ├── ui/                    # Atomic UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   └── index.ts
│   │   ├── IconButton/
│   │   ├── Badge/
│   │   ├── Avatar/
│   │   ├── Card/
│   │   ├── Divider/
│   │   └── index.ts
│   │
│   ├── forms/                 # Form components (Formik + Yup)
│   │   ├── TextField/
│   │   ├── PhoneInput/
│   │   ├── OTPInput/
│   │   ├── SelectField/
│   │   ├── DateField/
│   │   ├── RadioGroup/
│   │   ├── Checkbox/
│   │   ├── AmountChipSelector/
│   │   ├── SegmentedToggle/
│   │   ├── FileUpload/
│   │   ├── SearchInput/
│   │   ├── FormSection/
│   │   ├── SubmitButton/
│   │   └── validation/
│   │       ├── schemas.ts     # Yup validation schemas
│   │       └── helpers.ts
│   │
│   ├── layout/                # Layout components
│   │   ├── UserScreen/        # SafeArea + StatusBar wrapper
│   │   ├── UserHeader/        # Common header variants
│   │   ├── UserBottomBar/     # Bottom navigation
│   │   ├── ScreenSection/     # Content sections
│   │   ├── SectionCard/       # Card wrapper
│   │   ├── ProgressStepper/   # Registration flow stepper
│   │   └── KeyboardAwareScrollView/
│   │
│   ├── feedback/              # States & feedback
│   │   ├── Skeleton/
│   │   │   ├── SkeletonBox.tsx
│   │   │   ├── SkeletonCard.tsx
│   │   │   ├── SkeletonList.tsx
│   │   │   └── SkeletonForm.tsx
│   │   ├── EmptyState/
│   │   ├── ErrorState/
│   │   ├── LoadingOverlay/
│   │   ├── Toast/
│   │   └── index.ts
│   │
│   ├── lists/                 # List components
│   │   ├── ListItem/
│   │   ├── MemberListItem/
│   │   ├── NotificationItem/
│   │   ├── TransactionItem/
│   │   └── FilterChips/
│   │
│   └── motion/                # Animation wrappers (moti)
│       ├── FadeIn.tsx
│       ├── SlideIn.tsx
│       ├── StaggeredList.tsx
│       ├── PressableFeedback.tsx
│       └── index.ts
│
├── types/
│   ├── theme.types.ts         # Theme type definitions
│   ├── component.types.ts     # Shared component types
│   ├── form.types.ts          # Form-related types
│   ├── user.types.ts
│   ├── donation.types.ts
│   ├── event.types.ts
│   └── index.ts
│
├── services/
│   ├── api/
│   │   ├── client.ts
│   │   ├── endpoints.ts
│   │   └── interceptors.ts
│   ├── auth.ts
│   ├── storage.ts
│   └── index.ts
│
├── constants/
│   ├── routes.ts
│   ├── apiConfig.ts
│   ├── appConfig.ts
│   └── index.ts
│
├── notifications/
│   ├── notificationService.ts
│   ├── notificationTypes.ts
│   └── index.ts
│
├── hooks/
│   ├── useTheme.ts
│   ├── useKeyboard.ts
│   ├── useForm.ts
│   └── index.ts
│
└── utils/
    ├── formatters.ts
    ├── validators.ts
    └── index.ts
```

---

## 🎨 Design Tokens Specification

### 1. Colors (`src/theme/colors.ts`)

```typescript
export const colors = {
  // Primary Brand
  primary: {
    DEFAULT: "#f2780d", // Main orange
    light: "#ff8928", // Lighter orange
    dark: "#964900", // Darker orange
    muted: "rgba(242, 120, 13, 0.1)", // 10% opacity
    subtle: "rgba(242, 120, 13, 0.05)", // 5% opacity
    border: "rgba(242, 120, 13, 0.2)", // 20% for borders
    borderLight: "rgba(242, 120, 13, 0.1)", // 10% for light borders
  },

  // Backgrounds
  background: {
    DEFAULT: "#f8f7f5", // Main background
    warm: "#fdf9f6", // Warmer background (profile)
    surface: "#ffffff", // Cards, inputs
    surfaceAlt: "#f7f3f0", // Alternative surface
    muted: "#f5f5f4", // Muted backgrounds
    elevated: "#f1edea", // Elevated surfaces
  },

  // Text
  text: {
    primary: "#1a1a1a", // Main text (black)
    secondary: "#504441", // Secondary text
    muted: "#78716c", // Muted/helper text
    disabled: "#a8a29e", // Disabled text
    inverse: "#ffffff", // White text on dark bg
    brand: "#f2780d", // Orange text
  },

  // Borders
  border: {
    DEFAULT: "#e7e5e4", // Standard border
    light: "#d4c3be", // Light border
    muted: "rgba(212, 195, 190, 0.3)", // Very light
    input: "rgba(242, 120, 13, 0.2)", // Input borders
  },

  // Status Colors
  status: {
    success: "#00504b", // Success/verified
    successLight: "#e5f5f2",
    error: "#ba1a1a", // Error/danger
    errorLight: "#ffedea",
    warning: "#f2780d", // Warning (uses primary)
    warningLight: "rgba(242, 120, 13, 0.1)",
    info: "#0066cc",
    infoLight: "#e6f0ff",
  },

  // Semantic
  semantic: {
    verified: "#003733", // Verified badge bg
    verifiedLight: "#00504b",
  },

  // Admin Theme (separate)
  admin: {
    text: "#46291e",
    background: "#fdf9f6",
    surface: "#f7f3f0",
    accent: "#964900",
    border: "rgba(212, 195, 190, 0.3)",
  },

  // Utility
  transparent: "transparent",
  white: "#ffffff",
  black: "#000000",
  overlay: "rgba(0, 0, 0, 0.5)",
} as const;

export type AppColors = typeof colors;
```

### 2. Typography (`src/theme/typography.ts`)

```typescript
export const fontFamily = {
  // Primary font - Public Sans
  regular: "PublicSans-Regular",
  medium: "PublicSans-Medium",
  semibold: "PublicSans-SemiBold",
  bold: "PublicSans-Bold",
  extrabold: "PublicSans-ExtraBold",
  italic: "PublicSans-Italic",
} as const;

export const fontSize = {
  "2xs": 10, // Bottom nav labels
  xs: 12, // Captions, helper text
  sm: 14, // Body text, labels
  base: 16, // Standard body
  lg: 18, // Section headers
  xl: 20, // Page titles
  "2xl": 24, // Large numbers, stats
  "3xl": 30, // Hero text
  "4xl": 36, // Splash screens
  "5xl": 44, // Admin hero (special)
} as const;

export const lineHeight = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
} as const;

// Pre-composed text styles
export const textStyles = {
  // Headings
  h1: {
    fontFamily: fontFamily.extrabold,
    fontSize: fontSize["4xl"],
    lineHeight: lineHeight.tight,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize["3xl"],
    lineHeight: lineHeight.tight,
  },
  h3: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize["2xl"],
    lineHeight: lineHeight.snug,
  },
  h4: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.snug,
  },
  h5: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.snug,
  },

  // Body
  bodyLg: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    lineHeight: lineHeight.relaxed,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
  },
  bodySm: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.normal,
  },

  // Labels
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
  },
  labelSm: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.normal,
  },

  // Captions
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.normal,
  },
  captionXs: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize["2xs"],
    lineHeight: lineHeight.normal,
  },

  // Buttons
  buttonLg: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
  },
  button: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
  },
  buttonSm: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.xs,
  },
} as const;

export type AppTypography = typeof textStyles;
```

### 3. Spacing (`src/theme/spacing.ts`)

```typescript
// 4px base scale
export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
} as const;

// Semantic spacing
export const layoutSpacing = {
  screenPadding: spacing[4], // 16px - Standard screen padding
  sectionGap: spacing[6], // 24px - Gap between sections
  cardPadding: spacing[4], // 16px - Card internal padding
  cardPaddingLg: spacing[5], // 20px - Large card padding
  cardPaddingXl: spacing[6], // 24px - Extra large card padding
  inputPaddingX: spacing[3], // 12px - Input horizontal padding
  inputPaddingY: spacing[3], // 12px - Input vertical padding
  buttonPaddingX: spacing[4], // 16px - Button horizontal padding
  buttonPaddingY: spacing[3], // 12px - Button vertical padding
  buttonPaddingYLg: spacing[4], // 16px - Large button vertical padding
  itemGap: spacing[3], // 12px - Gap between list items
  iconGap: spacing[2], // 8px - Gap between icon and text
  bottomNavPadding: spacing[3], // 12px - Bottom nav padding
  bottomSafeArea: spacing[24], // 96px - Bottom safe area for content
} as const;

export type AppSpacing = typeof spacing;
```

### 4. Border Radius (`src/theme/radius.ts`)

```typescript
export const radius = {
  none: 0,
  sm: 4,
  DEFAULT: 8, // rounded-lg equivalent
  md: 8,
  lg: 12, // rounded-xl equivalent
  xl: 16, // rounded-2xl equivalent
  "2xl": 24,
  full: 9999, // Circular
} as const;

// Semantic radius
export const componentRadius = {
  button: radius.lg, // 12px - Primary buttons
  buttonSm: radius.DEFAULT, // 8px - Small buttons
  input: radius.lg, // 12px - Form inputs
  card: radius.lg, // 12px - Cards
  cardLg: radius.xl, // 16px - Large cards
  badge: radius.full, // Pill badges
  avatar: radius.full, // Circular avatars
  avatarSquare: radius.lg, // Square avatars
  tag: radius.DEFAULT, // 8px - Tags/chips
  bottomSheet: radius.xl, // 16px - Bottom sheets
} as const;

export type AppRadius = typeof radius;
```

### 5. Shadows (`src/theme/shadows.ts`)

```typescript
import { Platform } from "react-native";

export const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  DEFAULT: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  inner: {
    // For inner shadows (iOS only via background gradient)
  },
} as const;

export type AppShadows = typeof shadows;
```

### 6. Motion / Animation (`src/theme/motion.ts`)

```typescript
// For use with Moti library
export const motion = {
  // Durations
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 700,
  },

  // Easing (React Native Reanimated compatible)
  easing: {
    linear: [0, 0, 1, 1],
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    spring: { damping: 15, stiffness: 150 },
    springBouncy: { damping: 10, stiffness: 180 },
    springGentle: { damping: 20, stiffness: 120 },
  },

  // Common transitions
  transition: {
    fadeIn: {
      from: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { type: "timing", duration: 300 },
    },
    slideUp: {
      from: { opacity: 0, translateY: 20 },
      animate: { opacity: 1, translateY: 0 },
      transition: { type: "timing", duration: 300 },
    },
    slideDown: {
      from: { opacity: 0, translateY: -20 },
      animate: { opacity: 1, translateY: 0 },
      transition: { type: "timing", duration: 300 },
    },
    scale: {
      from: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: { type: "spring", damping: 15, stiffness: 150 },
    },
    pressable: {
      scale: 0.97,
      duration: 100,
    },
  },

  // Stagger delays
  stagger: {
    fast: 50,
    normal: 100,
    slow: 150,
  },
} as const;

export type AppMotion = typeof motion;
```

### 7. Layout Constants (`src/theme/layout.ts`)

```typescript
import { Dimensions, Platform, StatusBar } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const layout = {
  screen: {
    width: screenWidth,
    height: screenHeight,
  },

  // Status bar
  statusBar: {
    height: Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 24,
  },

  // Header
  header: {
    height: 56,
    iconSize: 22,
    iconButtonSize: 40,
  },

  // Bottom Navigation
  bottomNav: {
    height: 56,
    iconSize: 20,
    labelSize: 10,
  },

  // Safe areas (will be overridden by useSafeAreaInsets)
  safeArea: {
    top: Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 24,
    bottom: Platform.OS === "ios" ? 34 : 0,
  },

  // Content constraints
  content: {
    maxWidth: 480, // For tablets
  },

  // Image heights
  image: {
    hero: 200,
    card: 160,
    thumbnail: 80,
    avatar: {
      xs: 32,
      sm: 40,
      md: 56,
      lg: 64,
      xl: 80,
      "2xl": 128,
    },
  },

  // Z-index scale
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modal: 40,
    popover: 50,
    tooltip: 60,
    toast: 70,
  },
} as const;

export type AppLayout = typeof layout;
```

### 8. Icon Sizes (`src/theme/iconSizes.ts`)

```typescript
export const iconSizes = {
  xs: 14,
  sm: 16,
  DEFAULT: 18,
  md: 20,
  lg: 22,
  xl: 24,
  "2xl": 28,
  "3xl": 32,
} as const;

// Semantic icon sizes
export const iconContext = {
  bottomNav: iconSizes.md, // 20px
  header: iconSizes.lg, // 22px
  button: iconSizes.DEFAULT, // 18px
  buttonLg: iconSizes.md, // 20px
  listItem: iconSizes.md, // 20px
  card: iconSizes.lg, // 22px
  badge: iconSizes.sm, // 16px
  input: iconSizes.DEFAULT, // 18px
} as const;

export type AppIconSizes = typeof iconSizes;
```

---

## 🧩 Component Specifications

### 1. Button Component

**Variants:**

- `primary` - Orange filled button
- `secondary` - Orange outlined button
- `ghost` - Transparent with orange text
- `danger` - Red for destructive actions

**Sizes:**

- `sm` - 32px height, text-xs
- `md` - 40px height, text-sm (default)
- `lg` - 48px height, text-base

**States:**

- Default, Pressed (scale 0.97), Disabled, Loading

### 2. TextField Component

**Props:**

```typescript
interface TextFieldProps {
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  multiline?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardType;
  // Formik integration
  name: string;
}
```

**Styling:**

- Background: `#f8f7f5` or `white`
- Border: `rgba(242, 120, 13, 0.2)` or `#e7e5e4`
- Border on focus: `#f2780d`
- Border radius: 12px
- Padding: 12px horizontal, 12px vertical

### 3. UserHeader Component

**Variants:**

```typescript
type HeaderVariant =
  | "back-title" // ← Title
  | "back-title-action" // ← Title [action]
  | "logo-title-actions" // [logo] Title [notif] [menu]
  | "centered-title" // Title (centered)
  | "title-subtitle"; // Title + subtitle
```

### 4. UserBottomBar Component

**Props:**

```typescript
interface BottomBarItem {
  icon: IconName;
  label: string;
  route: string;
}

interface UserBottomBarProps {
  items: BottomBarItem[];
  activeRoute: string;
}
```

**Styling:**

- Height: 56px
- Icon size: 20px
- Label size: 10px
- Active color: `#f2780d`
- Inactive color: `#9ca3af`

### 5. Card Component

**Variants:**

- `default` - White background, subtle border
- `elevated` - White background, shadow
- `outlined` - Transparent with border
- `muted` - Light gray background
- `primary` - Orange background (ID card)

### 6. Skeleton Components

**Types:**

- `SkeletonBox` - Basic rectangular skeleton
- `SkeletonCircle` - Circular skeleton (avatars)
- `SkeletonText` - Text line skeleton
- `SkeletonCard` - Pre-composed card skeleton
- `SkeletonList` - List with multiple items
- `SkeletonForm` - Form fields skeleton

### 7. EmptyState Component

**Props:**

```typescript
interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}
```

### 8. ErrorState Component

**Props:**

```typescript
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}
```

---

## 📝 Form Validation Schemas (Yup)

```typescript
// src/components/forms/validation/schemas.ts
import * as Yup from "yup";

export const validationSchemas = {
  // Mobile number (India)
  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile number")
    .required("Mobile number is required"),

  // OTP
  otp: Yup.string()
    .matches(/^\d{6}$/, "Enter 6-digit OTP")
    .required("OTP is required"),

  // Name
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Name is required"),

  // Email
  email: Yup.string()
    .email("Enter valid email address")
    .required("Email is required"),

  // Amount
  amount: Yup.number()
    .positive("Amount must be positive")
    .min(1, "Minimum amount is ₹1")
    .required("Amount is required"),

  // Required select
  requiredSelect: Yup.string().required("Please select an option"),

  // Pincode (India)
  pincode: Yup.string()
    .matches(/^\d{6}$/, "Enter valid 6-digit pincode")
    .required("Pincode is required"),

  // Date
  date: Yup.date().required("Date is required"),

  // Required checkbox
  consent: Yup.boolean().oneOf([true], "You must accept the terms"),
};

// Pre-composed form schemas
export const formSchemas = {
  registration: Yup.object({
    mobile: validationSchemas.mobile,
    otp: validationSchemas.otp,
  }),

  profile: Yup.object({
    fullName: validationSchemas.name,
    fatherName: validationSchemas.name,
    gender: validationSchemas.requiredSelect,
    dob: validationSchemas.date,
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    pincode: validationSchemas.pincode,
    occupation: Yup.string().required("Occupation is required"),
  }),

  donation: Yup.object({
    donorName: validationSchemas.name,
    amount: validationSchemas.amount,
    message: Yup.string().max(200, "Message must be less than 200 characters"),
  }),
};
```

---

## 📦 Dependencies to Add

```json
{
  "dependencies": {
    "formik": "^2.4.5",
    "yup": "^1.3.2",
    "moti": "^0.28.0",
    "@expo-google-fonts/public-sans": "^0.2.3",
    "expo-font": "~12.0.0",
    "react-native-reanimated": "~3.10.0",
    "react-native-safe-area-context": "^4.8.2",
    "react-native-screens": "~3.29.0",
    "react-native-keyboard-aware-scroll-view": "^0.9.5"
  }
}
```

---

## 🚀 Implementation Phases

### Phase 1A: Foundation (Week 1)

1. ✅ Set up theme folder structure
2. ✅ Create all design tokens (colors, typography, spacing, etc.)
3. ✅ Configure Public Sans font loading
4. ✅ Update NativeWind/Tailwind config with custom tokens
5. ✅ Create ThemeProvider wrapper

### Phase 1B: Core Components (Week 2)

1. ✅ Button (all variants)
2. ✅ IconButton
3. ✅ Card (all variants)
4. ✅ Badge
5. ✅ Avatar
6. ✅ Divider

### Phase 1C: Layout Shell (Week 2-3)

1. ✅ UserScreen wrapper
2. ✅ UserHeader (all variants)
3. ✅ UserBottomBar
4. ✅ ScreenSection
5. ✅ SectionCard
6. ✅ ProgressStepper
7. ✅ KeyboardAwareScrollView integration

### Phase 1D: Form System (Week 3-4)

1. ✅ TextField
2. ✅ PhoneInput
3. ✅ OTPInput
4. ✅ SelectField
5. ✅ DateField
6. ✅ RadioGroup
7. ✅ Checkbox
8. ✅ AmountChipSelector
9. ✅ SegmentedToggle
10. ✅ FileUpload
11. ✅ SearchInput
12. ✅ FormSection
13. ✅ SubmitButton
14. ✅ Yup validation schemas

### Phase 1E: Feedback & States (Week 4)

1. ✅ Skeleton components (all variants)
2. ✅ EmptyState
3. ✅ ErrorState
4. ✅ LoadingOverlay
5. ✅ Toast/Notification

### Phase 1F: Animation (Week 4-5)

1. ✅ FadeIn wrapper
2. ✅ SlideIn wrapper
3. ✅ StaggeredList
4. ✅ PressableFeedback
5. ✅ Screen transition animations

### Phase 1G: Testing & Documentation (Week 5)

1. ✅ Component unit tests
2. ✅ Storybook setup (optional)
3. ✅ Usage documentation
4. ✅ Migration guide for Phase 2

---

## 📐 NativeWind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#f2780d",
          light: "#ff8928",
          dark: "#964900",
          muted: "rgba(242, 120, 13, 0.1)",
          subtle: "rgba(242, 120, 13, 0.05)",
        },
        background: {
          DEFAULT: "#f8f7f5",
          warm: "#fdf9f6",
          surface: "#ffffff",
          muted: "#f5f5f4",
          elevated: "#f1edea",
        },
        foreground: {
          DEFAULT: "#1a1a1a",
          secondary: "#504441",
          muted: "#78716c",
          disabled: "#a8a29e",
        },
        border: {
          DEFAULT: "#e7e5e4",
          light: "#d4c3be",
        },
        success: {
          DEFAULT: "#00504b",
          light: "#e5f5f2",
        },
        error: {
          DEFAULT: "#ba1a1a",
          light: "#ffedea",
        },
      },
      fontFamily: {
        sans: ["PublicSans-Regular"],
        "sans-medium": ["PublicSans-Medium"],
        "sans-semibold": ["PublicSans-SemiBold"],
        "sans-bold": ["PublicSans-Bold"],
        "sans-extrabold": ["PublicSans-ExtraBold"],
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px" }],
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
      },
    },
  },
  plugins: [],
};
```

---

## ✅ Acceptance Criteria

### Design Tokens

- [ ] All colors resolve correctly in light mode
- [ ] Public Sans font loads and applies globally
- [ ] Spacing scale matches audit findings
- [ ] Border radius tokens match existing screens

### Components

- [ ] Button renders all variants correctly
- [ ] Form fields show label, helper, error states
- [ ] UserHeader supports all variants
- [ ] UserBottomBar highlights active route
- [ ] Cards respect spacing and radius tokens

### Forms

- [ ] Formik binds correctly to all field types
- [ ] Yup validation shows error messages
- [ ] Keyboard handling doesn't clip inputs
- [ ] Submit button shows loading state

### States

- [ ] Skeleton animates smoothly
- [ ] EmptyState displays with icon and action
- [ ] ErrorState shows retry button
- [ ] Loading overlay blocks interaction

### Animation

- [ ] Moti wrappers mount without errors
- [ ] Staggered lists reveal smoothly
- [ ] Press feedback feels responsive
- [ ] No animation jank on low-end devices

### Visual Parity

- [ ] Donation screen matches HTML reference
- [ ] Dashboard/ID Card matches HTML reference
- [ ] Registration flow matches HTML reference

---

## 📎 Notes

1. **Admin pages are OUT OF SCOPE** for Phase 1. They use a different color palette (`#46291e`, `#964900`) and will be addressed in Phase 2 or later.

2. **Existing screens remain as-is** during Phase 1. They serve as visual reference only.

3. **Dark mode is NOT in scope** for Phase 1 but tokens are structured to support it later.

4. **Public Sans font** must be downloaded and added to the project assets.

5. **react-hook-form** code can remain temporarily but all new work uses Formik + Yup.
