"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../I18nProvider'
import { getAll } from '../../lib/store'
import { Calendar } from '../Calendar'
import { predict } from '../../lib/prediction'
import { parseISO, addDays, toISODate, startOfMonth, endOfMonth } from '../../lib/date'

export function CalendarPage() {
  const { t } = useI18n()
  const [data, setData] = useState<any>({ cycles: [], symptoms: [], settings: { locale: 'ja', ovulationOffset: 14 } })
  useEffect(() => { (async () => setData(await getAll()))() }, [])
  const month = new Date()
  const pred = useMemo(() => predict(data.cycles, data.settings), [data])
  const period = new Set<string>()
  // naive: use each cycle length_days as menstruation length 5 days from start
  for (const c of data.cycles) {
    const s = parseISO(c.start_date)
    for (let i = 0; i < 5; i++) period.add(toISODate(addDays(s, i)))
  }
  const fert = new Set<string>()
  if (pred.fertileWindow) {
    const s = parseISO(pred.fertileWindow.start)
    const e = parseISO(pred.fertileWindow.end)
    const cur = new Date(s)
    while (cur <= e) { fert.add(toISODate(cur)); cur.setDate(cur.getDate() + 1) }
  }
  return (
    <div className="py-4 space-y-3">
      <h1 className="container-mobile text-xl font-semibold">{t('calendar')}</h1>
      <Calendar month={month} periodDates={period} fertilityDates={fert} ovulationDate={pred.ovulationDate} nextStartDate={pred.nextStartDate} />
      <div className="container-mobile text-sm text-gray-600 flex gap-3">
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 bg-red-500 inline-block rounded" /> 生理</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 bg-green-300 inline-block rounded" /> 受精可能性</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 bg-fuchsia-500 inline-block rounded-full" /> 排卵</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 border border-blue-500 inline-block rounded" /> 次回</span>
      </div>
    </div>
  )
}
