import { describe, it, expect } from 'vitest'
import { summarizeForShare, encodeShare, decodeShare } from '../../lib/share'

describe('share encode/decode', () => {
  it('round trips', () => {
    const data = { cycles: [{ start_date: '2025-07-01', length_days: 28 }], symptoms: [{ date: '2025-07-02', mood: 'ok' }], settings: { locale: 'ja' as const, ovulationOffset: 14 } }
    const sum = summarizeForShare(data as any)
    const payload = encodeShare(sum)
    const back = decodeShare(payload)
    expect(back.version).toBe(1)
    expect(back.cycles.length).toBe(1)
    expect(back.symptoms.length).toBe(1)
  })
})
