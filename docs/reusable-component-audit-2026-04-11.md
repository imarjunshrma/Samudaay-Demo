# Reusable Component Audit

Date: 2026-04-11

## Finance

- Moved `EventAnalyticsSummaryCard` from `src/features/finance/components/finance-analytics-content.tsx` into `src/features/finance/components/finance-blocks.tsx`.
- Kept the event analytics screen design unchanged; only the helper ownership changed.
- `TransactionManagementSummaryCard` and `ProfitLossSummaryCard` already live in `finance-blocks.tsx` and remain shared.
- Moved the yearly P&L helpers `YearlyIncomeCard` and `ExpenseItem` into `finance-blocks.tsx` as `ProfitLossYearlyIncomeCard` and `ProfitLossExpenseItem`.

## Event Profit & Loss

- `src/features/finance/components/profit-loss-screen-content.tsx` now composes the shared `ProfitLossSummaryCard` and shared `BreakdownRow`.
- Income and expense rows keep the same visual design but use shared primitives for consistency.

## Events

- Moved the event performance dashboard add-on usage card into `src/features/events/components/event-shared-blocks.tsx` as `EventAddOnUsageCard`.
- `src/features/events/components/event-performance-dashboard-content.tsx` now only composes the shared event chart/card primitives.

## Profile

- Moved `ProfileActionIcon` from `src/features/profile/components/my-profile-content.tsx` into `src/features/profile/components/profile-blocks.tsx`.
- `src/features/profile/components/my-profile-content.tsx` now composes only shared profile primitives.

## Forms

- Moved `StudentCard` from `src/features/forms/components/children-education-directory-content.tsx` into `src/features/forms/components/children-education-directory-blocks.tsx`.
- `src/features/forms/components/children-education-directory-content.tsx` now composes the shared directory card helper.

## Verify These Pages

- [Finance Analytics](/Users/bridgestonetec/Codebase/upwork-stitch/app/finance/finance-analytics.tsx)
- [Yearly Profit & Loss](/Users/bridgestonetec/Codebase/upwork-stitch/app/finance/profit-loss-yearly.tsx)
- [Event Profit & Loss](/Users/bridgestonetec/Codebase/upwork-stitch/app/finance/profit-loss-event.tsx)
- [Event Performance Dashboard](/Users/bridgestonetec/Codebase/upwork-stitch/app/events/event-performance-dashboard.tsx)
- [My Profile](/Users/bridgestonetec/Codebase/upwork-stitch/app/profile/my-profile.tsx)
- [Children Education Directory](/Users/bridgestonetec/Codebase/upwork-stitch/app/forms/children-education-directory.tsx)
- [Role Management](/Users/bridgestonetec/Codebase/upwork-stitch/app/admin/roles.tsx)
- [Create Matrimony Profile](/Users/bridgestonetec/Codebase/upwork-stitch/app/matrimony/create-profile.tsx)

## Notes

- No layout or color-token changes were made in this pass.
- The goal was to remove screen-local card helpers and keep screen files focused on composition only.
- `AnalyticsCardShell` was promoted to `AdminAnalyticsCardShell` in the admin analytics block layer so the repeated analytics card chrome has a clear shared home.

## Remaining Gaps

- No screen-local UI helpers remain in the audited finance, event, profile, forms, matrimony, or communication pages.
- The remaining `type` declarations in screen files are data-shape aliases only and do not affect reusability.
- `src/features/admin/components/admin-analytics-blocks.tsx` still has a private `AnalyticsCardShell` helper, but it is intentionally internal to the shared admin analytics block layer rather than a screen-local helper.
- `src/features/admin/components/manage-events-content.tsx` still carries route mode and icon-name type aliases for list/create composition, but the actual UI fragments now live in shared blocks.

## Suggestions

- The admin analytics shell extraction is done. Keep using `AdminAnalyticsCardShell` for any new analytics cards in the admin module.
- Consider introducing a tiny shared `SectionHeader`/`SectionDivider` primitive only if you see the same heading + rule composition repeated in at least three screens. It is not worth extracting yet based on the current audit.
- Keep `type` aliases local when they describe route-specific state, but move any reusable item shapes into `constants` or shared `types` files once they are used by more than one screen.
- For future screens, start by composing shared blocks first, then add screen-specific wrappers only when a layout truly cannot be shared.
