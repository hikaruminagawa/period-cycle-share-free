"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from './I18nProvider'
import type { Route } from 'next'

const tabs = [
  { href: '/' as Route, key: 'home', labelKey: 'home' },
  { href: '/log' as Route, key: 'log', labelKey: 'log' },
  { href: '/calendar' as Route, key: 'calendar', labelKey: 'calendar' },
  { href: '/share' as Route, key: 'share', labelKey: 'share' },
  { href: '/settings' as Route, key: 'settings', labelKey: 'settings' },
] as const

export function BottomTabNav() {
  const pathname = usePathname()
  const { t } = useI18n()
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white/90 dark:bg-gray-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <ul className="flex justify-between max-w-md mx-auto">
        {tabs.map(tab => {
          const active = pathname === tab.href
          return (
            <li key={tab.key} className="flex-1">
              <Link href={tab.href} className={`block text-center py-3 tap-target ${active ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>{t(tab.labelKey)}</Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
