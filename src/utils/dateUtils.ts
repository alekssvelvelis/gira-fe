export function formatYearMonth(ym: string | Date) {
  const date = typeof ym === 'string'
      ? new Date(parseInt(ym.split('-')[0]), parseInt(ym.split('-')[1]) - 1)
      : ym;

  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
}