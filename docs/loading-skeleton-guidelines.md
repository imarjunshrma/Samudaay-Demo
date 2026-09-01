## Loading Skeleton Guidelines

- Do not use full-page spinner-only loading states.
- Do not render blank pages while waiting for API data.
- Keep the page shell mounted and swap only the inner content between skeleton and loaded content.
- Reserve final layout space with skeletons that match the real card, row, image, form, and detail dimensions.
- Show empty states only after loading is complete and the final data set is empty.
- Show error states only after loading is complete and the request failed.
- During refresh, keep existing data visible and use only small inline refresh affordances.
- During pagination, append row/card skeletons at the bottom instead of replacing the list.
- Mutation loading should stay inline to the action button or submit bar and must not collapse page layout.

### Component Placement

- Shared loading primitives live in `frontend/src/components/skeletons/`.
- Low-level animated blocks remain in `frontend/src/components/ui/skeleton/`.
- New screens should compose page-specific skeletons from the shared set before introducing ad hoc placeholders.

### Reserved Layout Rules

- Headers should keep a stable height between loading and loaded states.
- Cards, rows, and tables should use fixed or minimum heights that match the final UI.
- Images and avatars must render inside fixed-size containers or a fixed `aspectRatio`.
- Forms should reserve the final input and footer/button space while async data loads.

### Recommended Flow

1. Render the normal page wrapper and header immediately.
2. Render a page/detail/form/list skeleton inside the content area for initial load.
3. Replace only the inner content when data arrives.
4. Render empty/error states only after the request has settled.

### Slow Network Checklist

1. Open the screen with network throttled or an artificial API delay enabled.
2. Confirm the header, drawer trigger, tabs, and footer stay mounted and do not jump.
3. Confirm the first paint shows a page-aligned skeleton, not a spinner-only or blank screen.
4. Confirm cards, rows, charts, forms, and images keep their final height or aspect ratio while loading.
5. Confirm empty state appears only after loading completes with no data.
6. Confirm error state appears only after loading fails.
7. Confirm pull-to-refresh or refocus keeps old content visible and does not replace the page with a skeleton.
8. Confirm pagination appends bottom skeleton rows/cards instead of clearing the list.
