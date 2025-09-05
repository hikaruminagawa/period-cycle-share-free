export const toISODate = (d: Date) => d.toISOString().slice(0, 10)
export const addDays = (date: Date, days: number) => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}
export const diffDays = (a: Date, b: Date) => Math.round((a.getTime() - b.getTime()) / 86400000)
export const parseISO = (s: string) => new Date(s + 'T00:00:00')
export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
export const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0)
