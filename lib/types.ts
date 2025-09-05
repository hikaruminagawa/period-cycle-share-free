export type Cycle = { start_date: string; length_days: number }
export type Symptom = { date: string; mood?: string; pain?: number; temp?: number; flow?: number; memo?: string }
export type Settings = { locale: 'ja' | 'en'; ovulationOffset: number }
export type Data = { cycles: Cycle[]; symptoms: Symptom[]; settings: Settings }
