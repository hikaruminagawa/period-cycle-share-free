import { describe, it, expect } from 'vitest'
import { predict } from '../../lib/prediction'

describe('prediction', () => {
  const settings = { locale: 'ja' as const, ovulationOffset: 14 }
  it('computes reliability based on variance and count', () => {
    const cycles = [
      { start_date: '2025-06-01', length_days: 28 },
      { start_date: '2025-06-29', length_days: 28 },
      { start_date: '2025-07-27', length_days: 28 },
    ]
    const p = predict(cycles, settings)
    expect(p.reliability).toBe('High')
    expect(p.averageCycle).toBe(28)
  })
  it('handles low data', () => {
    const cycles = [
      { start_date: '2025-07-01', length_days: 30 },
      { start_date: '2025-07-31', length_days: 31 },
    ]
    const p = predict(cycles, settings)
    expect(p.reliability).toBe('Low')
  })
})
