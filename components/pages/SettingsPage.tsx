"use client"
import React, { useEffect, useState } from 'react'
import { useI18n } from '../I18nProvider'
import { getAll, saveSettings, exportJson, importJson } from '../../lib/store'

export function SettingsPage() {
  const { t, locale, setLocale } = useI18n()
  const [ov, setOv] = useState(14)
  useEffect(() => { (async () => { const d = await getAll(); setOv(d.settings.ovulationOffset) })() }, [])
  async function apply() {
    await saveSettings({ locale, ovulationOffset: ov })
  }
  async function doExport() {
    const j = await exportJson()
    const blob = new Blob([j], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'naoapp-data.json'; a.click()
    URL.revokeObjectURL(url)
  }
  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    await importJson(text)
    alert('Imported')
  }
  return (
    <div className="container-mobile py-4 space-y-4">
      <h1 className="text-xl font-semibold">{t('settings')}</h1>
      <div className="space-y-2">
        <label className="block text-sm">{t('language')}</label>
        <select value={locale} onChange={e => setLocale(e.target.value as any)} className="border rounded p-2 w-full">
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm">{t('ovulationOffset')}: {ov} days</label>
        <input type="range" min={12} max={16} value={ov} onChange={e => setOv(parseInt(e.target.value))} className="w-full" />
      </div>
      <button onClick={apply} className="w-full bg-blue-600 text-white py-3 rounded">{t('save')}</button>
      <div className="flex gap-2">
        <button onClick={doExport} className="flex-1 bg-gray-200 py-3 rounded">{t('export')}</button>
        <label className="flex-1 bg-gray-200 py-3 rounded text-center">
          {t('import')}
          <input type="file" accept="application/json" onChange={onImport} className="hidden" />
        </label>
      </div>
      <p className="text-sm text-gray-600">{t('disclaimer')}</p>
    </div>
  )
}
