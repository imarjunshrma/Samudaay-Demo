# Navigation Architecture

This app uses Expo Router with one root stack and role-specific shells.

## Route placement rules

- Put auth, onboarding, splash, and session-guarded redirects at the root `app/` stack.
- Put admin-owned screens under `app/admin/`.
- Put member-owned screens under `app/member/`.
- Put admin bottom-tab screens only inside `app/admin/(tabs)/`.
- Put member bottom-tab screens only inside `app/member/(tabs)/`.
- Keep `app/admin/_layout.tsx` and `app/member/_layout.tsx` as drawer shells that register `(tabs)` plus non-tab drawer pages.
- Shared standalone routes like `/profile/*`, `/events/*`, `/finance/*`, and `/communication/*` must receive a `returnTo` param when opened from admin/member shells if the expected back target is shell-specific.

## Shell structure

```text
app/_layout.tsx
  Stack
   ├── public/auth routes
   ├── admin/_layout.tsx
   │    Drawer
   │     ├── (tabs)
   │     └── other admin routes
   └── member/_layout.tsx
        Drawer
         ├── (tabs)
         └── other member routes
```

```text
app/admin/(tabs)/_layout.tsx
  Bottom Tabs
   ├── dashboard
   ├── manage-directory
   ├── invoices
   └── profile
```

```text
app/member/(tabs)/_layout.tsx
  Bottom Tabs
   ├── index
   ├── community
   ├── members
   ├── matrimony
   └── profile
```

## Navigation rules

- Use `router.push()` for normal forward navigation to detail, edit, create, and drill-down pages.
- Use `router.replace()` only for auth/session redirects, onboarding redirects, logout, or true root-section switching.
- Use `useBackNavigation()` or `safeBack(fallbackRoute)` for back buttons.
- Prefer feature-aware fallbacks like list/detail parents instead of dashboard/home fallbacks.
- If a shared screen can be opened from both admin and member shells, pass `returnTo` from the caller instead of hardcoding one profile/dashboard fallback.
