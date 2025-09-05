"use client"
import { get, set, update, del } from 'idb-keyval'
import type { Cycle, Symptom, Data, Settings } from './types'

const DB_KEYS = {
  cycles: 'cycles',
  symptoms: 'symptoms',
  settings: 'settings',
} as const

export async function getAll(): Promise<Data> {
  const [cycles = [], symptoms = [], settings = getDefaultSettings()] = await Promise.all([
    get<Cycle[]>(DB_KEYS.cycles),
    get<Symptom[]>(DB_KEYS.symptoms),
    get<Settings>(DB_KEYS.settings),
  ])
  return { cycles, symptoms, settings }
}

export function getDefaultSettings(): Settings {
  const ls = typeof window !== 'undefined' ? localStorage.getItem('locale') as Settings['locale'] | null : null
  return { locale: ls ?? 'ja', ovulationOffset: 14 }
}

export async function saveCycle(cycle: Cycle) {
  await update(DB_KEYS.cycles, (arr?: Cycle[]) => {
    const next = Array.isArray(arr) ? arr.slice() : []
    // replace by same start_date or push
    const idx = next.findIndex(c => c.start_date === cycle.start_date)
    if (idx >= 0) next[idx] = cycle
    else next.push(cycle)
    next.sort((a, b) => a.start_date.localeCompare(b.start_date))
    return next
  })
}

export async function saveSymptom(sym: Symptom) {
  await update(DB_KEYS.symptoms, (arr?: Symptom[]) => {
    const next = Array.isArray(arr) ? arr.slice() : []
    const idx = next.findIndex(s => s.date === sym.date)
    if (idx >= 0) next[idx] = { ...next[idx], ...sym }
    else next.push(sym)
    next.sort((a, b) => a.date.localeCompare(b.date))
    return next
  })
}

export async function saveSettings(settings: Settings) {
  await set(DB_KEYS.settings, settings)
  try { localStorage.setItem('locale', settings.locale) } catch { }
}

export async function exportJson(): Promise<string> {
  const data = await getAll()
  return JSON.stringify(data)
}

export async function importJson(json: string) {
  const data = JSON.parse(json) as Data
  await Promise.all([
    set(DB_KEYS.cycles, data.cycles ?? []),
    set(DB_KEYS.symptoms, data.symptoms ?? []),
    set(DB_KEYS.settings, data.settings ?? getDefaultSettings()),
  ])
}

export async function clearAll() {
  await Promise.all([del(DB_KEYS.cycles), del(DB_KEYS.symptoms), del(DB_KEYS.settings)])
}
