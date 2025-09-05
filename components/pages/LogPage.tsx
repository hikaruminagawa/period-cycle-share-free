"use client"
import React, { useEffect, useState } from 'react'
import { useI18n } from '../I18nProvider'
import { getAll, saveSymptom } from '../../lib/store'
import { toISODate } from '../../lib/date'

export function LogPage() {
  const { t } = useI18n()
  const [today] = useState(() => toISODate(new Date()))
  const [memo, setMemo] = useState('')
  const [mood, setMood] = useState<string | undefined>()
  const [pain, setPain] = useState<number | undefined>()
  const [temp, setTemp] = useState<number | undefined>()
  const [flow, setFlow] = useState<number | undefined>()
  const [saved, setSaved] = useState(false)
  async function oneTap(k: 'mood' | 'pain' | 'temp' | 'flow', v: string | number) {
    const patch: any = { date: today }
    patch[k] = v
    await saveSymptom(patch)
    setSaved(true)
    setTimeout(() => setSaved(false), 1200)
  }
  async function saveAll() {
    await saveSymptom({ date: today, memo, mood, pain, temp, flow })
    setSaved(true)
    setTimeout(() => setSaved(false), 1200)
  }
  return (
    <div className="container-mobile py-4 space-y-3">
      <h1 className="text-xl font-semibold">{t('log')}</h1>
      <div className="grid grid-cols-4 gap-2">
        <button className="px-2 py-3 rounded bg-blue-100" onClick={() => oneTap('mood', 'good')}>{t('mood')}</button>
        <button className="px-2 py-3 rounded bg-red-100" onClick={() => oneTap('pain', 1)}>{t('pain')}</button>
        <button className="px-2 py-3 rounded bg-amber-100" onClick={() => oneTap('temp', 36.5)}>{t('temp')}</button>
        <button className="px-2 py-3 rounded bg-pink-100" onClick={() => oneTap('flow', 1)}>{t('flow')}</button>
      </div>
      <textarea value={memo} onChange={e => setMemo(e.target.value)} placeholder={t('memo')} className="w-full border rounded p-2" rows={4} />
      <button onClick={saveAll} className="w-full bg-blue-600 text-white py-3 rounded tap-target">{t('save')}</button>
      {saved && <div className="text-center text-green-600">Saved</div>}
    </div>
  )
}
