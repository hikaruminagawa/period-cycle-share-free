"use client"
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Locale = 'ja' | 'en'

const dict: Record<Locale, Record<string, string>> = {
  ja: {
    home: 'ホーム', log: 'ログ', calendar: 'カレンダー', share: '共有', settings: '設定',
    today: '今日', nextPeriod: '次回予測', ovulation: '排卵推定', window: '受精可能性',
    addStart: '生理開始を記録', createShare: '共有リンクを作成', disclaimer: '本アプリの予測は医療目的ではありません。体調に不安がある場合は医療機関に相談してください。',
    mood: '気分', pain: '痛み', temp: '体温', flow: '出血量', memo: 'メモ', save: '保存',
    import: 'インポート', export: 'エクスポート', language: '言語', ovulationOffset: '排卵日調整',
    copy: 'コピー', copied: 'コピーしました', readOnly: '閲覧専用',
  },
  en: {
    home: 'Home', log: 'Log', calendar: 'Calendar', share: 'Share', settings: 'Settings',
    today: 'Today', nextPeriod: 'Next period', ovulation: 'Ovulation', window: 'Fertility window',
    addStart: 'Add period start', createShare: 'Create share link', disclaimer: 'Predictions are not for medical use. Consult a professional if needed.',
    mood: 'Mood', pain: 'Pain', temp: 'Temp', flow: 'Flow', memo: 'Memo', save: 'Save',
    import: 'Import', export: 'Export', language: 'Language', ovulationOffset: 'Ovulation offset',
    copy: 'Copy', copied: 'Copied', readOnly: 'Read-only',
  }
}

type I18nContextType = {
  t: (key: string) => string
  locale: Locale
  setLocale: (l: Locale) => void
}

const I18nContext = createContext<I18nContextType | null>(null)

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(() => (typeof window !== 'undefined' ? (localStorage.getItem('locale') as Locale) : 'ja') || 'ja')
  useEffect(() => {
    try { localStorage.setItem('locale', locale) } catch { }
  }, [locale])
  const value = useMemo<I18nContextType>(() => ({
    locale,
    setLocale,
    t: (k: string) => (dict as any)[locale][k] ?? k,
  }), [locale])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('I18nProvider missing')
  return ctx
}
