"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../I18nProvider'
import { getAll, saveCycle } from '../../lib/store'
import { predict } from '../../lib/prediction'
import { toISODate } from '../../lib/date'
import type { Data } from '../../lib/types'

export function HomePage() {
  const { t } = useI18n()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Data>({ cycles: [], symptoms: [], settings: { locale: 'ja', ovulationOffset: 14 } })
  useEffect(() => { (async () => { setData(await getAll()); setLoading(false) })() }, [])
  const pred = useMemo(() => predict(data.cycles as any, data.settings as any), [data])
  const [startInput, setStartInput] = useState<string>(() => toISODate(new Date()))
  const [length, setLength] = useState<number>(28)
  async function addStart() {
    await saveCycle({ start_date: startInput, length_days: length })
    setData(await getAll())
  }
  if (loading) return <div className="container-mobile py-6">Loading…</div>
  return (
    <div className="container-mobile py-4 space-y-4">
      <h1 className="text-xl font-semibold">{t('home')}</h1>
      <section className="space-y-2">
        <div className="text-sm text-gray-600">{t('disclaimer')}</div>
        <div className="p-3 rounded-lg border">
          <div>{t('nextPeriod')}: <strong>{pred.nextStartDate ?? '-'}</strong></div>
          <div>{t('ovulation')}: <strong>{pred.ovulationDate ?? '-'}</strong></div>
          <div>{t('window')}: <strong>{pred.fertileWindow ? `${pred.fertileWindow.start} – ${pred.fertileWindow.end}` : '-'}</strong></div>
          <div>Reliability: <span className={`inline-block px-2 py-0.5 rounded text-white ${pred.reliability === 'High' ? 'bg-green-600' : pred.reliability === 'Med' ? 'bg-yellow-600' : 'bg-gray-600'}`}>{pred.reliability}</span></div>
        </div>
      </section>
      <section className="space-y-2">
        <h2 className="font-medium">{t('addStart')}</h2>
        <div className="flex gap-2">
          <input type="date" value={startInput} onChange={e => setStartInput(e.target.value)} className="border rounded px-2 py-2 flex-1" />
          <input type="number" value={length} onChange={e => setLength(parseInt(e.target.value || '0'))} className="border rounded px-2 py-2 w-24" min={15} max={60} />
          <button onClick={addStart} className="px-3 py-2 bg-blue-600 text-white rounded tap-target">Save</button>
        </div>
      </section>
    </div>
  )
}
