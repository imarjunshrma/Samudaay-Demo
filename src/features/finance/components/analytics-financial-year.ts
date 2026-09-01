export type AnalyticsYearFilter = `FY ${number}-${string}` | 'All Time';

export function getCurrentFinancialYearLabel(now = new Date()) {
  const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return `FY ${year}-${String(year + 1).slice(-2)}` as AnalyticsYearFilter;
}

export function buildAnalyticsYearFilters(now = new Date()): AnalyticsYearFilter[] {
  const currentYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return [
    `FY ${currentYear}-${String(currentYear + 1).slice(-2)}` as AnalyticsYearFilter,
    `FY ${currentYear - 1}-${String(currentYear).slice(-2)}` as AnalyticsYearFilter,
    `FY ${currentYear - 2}-${String(currentYear - 1).slice(-2)}` as AnalyticsYearFilter,
    'All Time',
  ];
}

export function resolveAnalyticsYearRange(selectedYear: AnalyticsYearFilter) {
  if (selectedYear === 'All Time') {
    return {
      startDate: '2000-01-01',
      endDate: new Date().toISOString().slice(0, 10),
    };
  }

  const match = /^FY (\d{4})-(\d{2})$/.exec(selectedYear);
  if (!match) {
    return {};
  }

  const startYear = Number(match[1]);
  const endYear = Number(`20${match[2]}`);

  return {
    startDate: `${startYear}-04-01`,
    endDate: `${endYear}-03-31`,
  };
}
