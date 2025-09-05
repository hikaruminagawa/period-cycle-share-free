import type { Cycle, Settings } from './types'
import { parseISO, addDays } from './date'

export type Prediction = {
  averageCycle: number | null
  nextStartDate: string | null
  ovulationDate: string | null
  fertileWindow: { start: string; end: string } | null
  reliability: 'Low' | 'Med' | 'High'
}

function trimmedMean(nums: number[]): number {
  if (nums.length <= 2) return nums.reduce((a, b) => a + b, 0) / nums.length
  const sorted = nums.slice().sort((a, b) => a - b)
  const trimmed = sorted.slice(1, -1)
  return trimmed.reduce((a, b) => a + b, 0) / trimmed.length
}

function variance(nums: number[], mean: number) {
  if (nums.length === 0) return 0
  const v = nums.reduce((acc, n) => acc + (n - mean) * (n - mean), 0) / nums.length
  return v
}

export function predict(cycles: Cycle[], settings: Settings): Prediction {
  const sorted = cycles.slice().sort((a, b) => a.start_date.localeCompare(b.start_date))
  if (sorted.length === 0) return { averageCycle: null, nextStartDate: null, ovulationDate: null, fertileWindow: null, reliability: 'Low' }
  const lengths = sorted.map(c => c.length_days)
  const avg = lengths.length >= 3 ? Math.round(trimmedMean(lengths)) : Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
  const last = parseISO(sorted[sorted.length - 1].start_date)
  const next = addDays(last, avg)
  const ovul = addDays(next, -settings.ovulationOffset)
  const fertileStart = addDays(ovul, -5)
  const fertileEnd = addDays(ovul, 1)
  const v = variance(lengths, avg)
  let reliability: Prediction['reliability'] = 'Low'
  if (lengths.length >= 3 && v < 6) reliability = 'High'
  else if (lengths.length >= 3 && v < 20) reliability = 'Med'
  return {
    averageCycle: avg,
    nextStartDate: next.toISOString().slice(0, 10),
    ovulationDate: ovul.toISOString().slice(0, 10),
    fertileWindow: { start: fertileStart.toISOString().slice(0, 10), end: fertileEnd.toISOString().slice(0, 10) },
    reliability,
  }
}
