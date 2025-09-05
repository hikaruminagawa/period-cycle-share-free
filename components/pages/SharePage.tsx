"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../I18nProvider'
import { getAll } from '../../lib/store'
import { summarizeForShare, encodeShare, decodeShare, ShareSummary } from '../../lib/share'
import { Calendar } from '../Calendar'
import { predict } from '../../lib/prediction'

export function SharePage() {
  const { t } = useI18n()
  const [data, setData] = useState<any>()
  const [payload, setPayload] = useState<string>('')
  const [shareUrl, setShareUrl] = useState<string>('')
  const [readOnly, setReadOnly] = useState<ShareSummary | null>(null)

  useEffect(() => { (async () => setData(await getAll()))() }, [])
  useEffect(() => {
    if (typeof window === 'undefined') return
    const frag = window.location.hash?.slice(1)
    if (frag) {
      try { setReadOnly(decodeShare(frag)) } catch { }
    }
  }, [])

  function createLink() {
    const sum = summarizeForShare(data)
    const p = encodeShare(sum)
    setPayload(p)
    setShareUrl(`${location.origin}/share#${p}`)
    navigator.clipboard?.writeText(`${location.origin}/share#${p}`).catch(() => { })
  }

  if (readOnly) {
    const cycles = readOnly.cycles
    const settings = { locale: 'ja', ovulationOffset: 14 }
    const pred = predict(cycles as any, settings as any)
    const period = new Set<string>()
    for (const c of cycles) for (let i = 0; i < 5; i++) period.add(new Date(new Date(c.start_date).getTime() + i * 86400000).toISOString().slice(0, 10))
    const fert = new Set<string>()
    if (pred.fertileWindow) {
      const s = new Date(pred.fertileWindow.start)
      const e = new Date(pred.fertileWindow.end)
      const cur = new Date(s)
      while (cur <= e) { fert.add(cur.toISOString().slice(0, 10)); cur.setDate(cur.getDate() + 1) }
    }
    return (
      <div className="py-4 space-y-3">
        <div className="container-mobile text-sm text-gray-500">{t('readOnly')}</div>
        <Calendar month={new Date()} periodDates={period} fertilityDates={fert} ovulationDate={pred.ovulationDate} nextStartDate={pred.nextStartDate} />
      </div>
    )
  }

  return (
    <div className="container-mobile py-4 space-y-3">
      <h1 className="text-xl font-semibold">{t('share')}</h1>
      <p className="text-sm text-gray-600">直近90日分の概要をURLフラグメント(#)にエンコードして共有します。URLを知っている人全員が閲覧できます。</p>
      <button className="w-full bg-blue-600 text-white py-3 rounded" onClick={createLink}>{t('createShare')}</button>
      {shareUrl && (
        <div className="space-y-2">
          <input className="w-full border rounded p-2" value={shareUrl} readOnly />
          <div className="text-sm text-gray-600">{t('copied')}</div>
        </div>
      )}
    </div>
  )
}
