type PaginationLike = {
  total?: number | null;
  totalCount?: number | null;
} | null | undefined;

export function getPaginationTotal(pagination: PaginationLike, fallback = 0) {
  const total = pagination?.total;
  if (typeof total === 'number' && Number.isFinite(total)) {
    return total;
  }

  const totalCount = pagination?.totalCount;
  if (typeof totalCount === 'number' && Number.isFinite(totalCount)) {
    return totalCount;
  }

  return fallback;
}
