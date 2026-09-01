# Final Device QA & Release Readiness Checklist

Use this checklist on Android and iOS development builds before declaring the app production-ready.

## Current Status

- Code verified:
  - `npm run lint`
  - `npx tsc --noEmit`
- Real Expo Router structure
- Firebase native auth, Firestore, and Storage integrated
- KYC upload UI implemented
- Role-based guards implemented
- Skeleton + loading UX implemented
- `FlatList` used for heavy lists

`Still requires full real device validation`

## 1. Auth & Session Flow

- [ ] Login with phone number works
- [ ] OTP is received and verified successfully
- [ ] Invalid OTP handled correctly
- [ ] Expired OTP handled correctly
- [ ] Resend OTP flow works
- [ ] Multiple OTP requests handled safely
- [ ] App background during OTP does not break flow
- [ ] PIN setup and verification works
- [ ] Onboarding flow completes correctly
- [ ] KYC upload enforced before completion
- [ ] Correct dashboard/profile landing
- [ ] Session restores after app restart
- [ ] Logout clears session correctly
- [ ] Unauthorized routes redirect correctly

## 2. KYC Upload Flow

- [ ] PDF/image selection works
- [ ] Upload progress visible
- [ ] Upload completes successfully
- [ ] Retry failed upload works
- [ ] Remove uploaded file works
- [ ] Minimum document rule enforced
- [ ] Background upload handled
- [ ] Large files handled properly
- [ ] Poor network handled gracefully

## 3. Firestore Data Flows

- [ ] Registration draft saved
- [ ] Profile updates persisted
- [ ] Event registration stored
- [ ] Donation entries stored
- [ ] Admin KYC approval updates data
- [ ] Firestore errors handled
- [ ] Permission-denied handled correctly

## 4. Navigation & Roles

- [ ] Onboarding-user flow works
- [ ] Member flow works
- [ ] Admin flow works
- [ ] Super-admin flow works
- [ ] Tabs visible per role
- [ ] Unauthorized screens blocked
- [ ] No navigation loops
- [ ] Deep links handled, if used

## 5. UX & Device Behavior

### Keyboard & Forms

- [ ] Android keyboard does not overlap inputs
- [ ] iOS keyboard does not overlap inputs
- [ ] Long forms scroll correctly
- [ ] Inputs accessible during typing
- [ ] Submit buttons visible

### Layout & Safe Area

- [ ] Safe areas respected
- [ ] No clipping on small screens
- [ ] Consistent spacing

### Multilingual

- [ ] Gujarati renders correctly
- [ ] English renders correctly
- [ ] No overflow/truncation issues

## 6. Loading & UX Feedback

- [ ] Skeleton loaders implemented correctly
- [ ] No blank loading screens
- [ ] Buttons show loading state
- [ ] Buttons disabled during actions
- [ ] No double-submit issues
- [ ] Clear error messages
- [ ] Retry flows available

## 7. Performance

- [ ] `FlatList` used for large lists
- [ ] Smooth scrolling
- [ ] No unnecessary re-renders
- [ ] Handles large datasets
- [ ] No crashes under load

## 8. Firebase Configuration Validation

- [ ] Firebase initializes correctly
- [ ] Phone auth works in dev build
- [ ] Firestore read/write works
- [ ] Storage uploads work
- [ ] Network failure handled

## 9. Firebase Rules

- [ ] Firestore rules allow valid access
- [ ] Firestore rules block invalid access
- [ ] Storage rules allow uploads
- [ ] Storage rules block unauthorized access

## 10. App Lifecycle & State Handling

- [ ] App background -> resume works correctly
- [ ] App killed -> restart restores state
- [ ] Upload resumes or fails safely
- [ ] Navigation state preserved

## 11. Error Simulation

- [ ] Network off during API handled
- [ ] Firestore permission denied handled
- [ ] Storage upload failure handled
- [ ] Slow network UX stable

## 12. Final Readiness Check

- [ ] End-to-end journey works on real device
- [ ] No critical crashes
- [ ] No broken navigation paths
- [ ] All core features usable
- [ ] App feels stable and production-like

## Blocking Notes

- Firebase native config must be correct
- Firestore & Storage rules must match flows
- OTP & uploads must be tested on real device/network

## Outcome

If all checks pass:

`App is ready for production hardening (security, scaling, release)`

If any fail:

`Fix issues before release`
