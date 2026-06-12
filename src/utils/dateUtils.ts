export function formatYearMonth(ym: string | Date) {
  const date = typeof ym === 'string'
      ? new Date(parseInt(ym.split('-')[0]), parseInt(ym.split('-')[1]) - 1)
      : ym;

  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
}

export function formatDateDayMonthYear(iso: string){
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function toYYYYMMDD(date: Date | string): string {
  return new Date(date).toISOString().split('T')[0];
}
