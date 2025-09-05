import './globals.css'
import type { Metadata } from 'next'
import { I18nProvider } from '../components/I18nProvider'
import { BottomTabNav } from '../components/BottomTabNav'

export const metadata: Metadata = {
  title: 'NaoApp',
  description: 'PWA period tracker',
  manifest: '/manifest.json',
  icons: [
    { rel: 'icon', url: '/icons/icon-192.png', sizes: '192x192' },
    { rel: 'apple-touch-icon', url: '/icons/icon-192.png' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <I18nProvider>
          <div className="pb-16 min-h-screen">
            {children}
          </div>
          <BottomTabNav />
        </I18nProvider>
        <script dangerouslySetInnerHTML={{
          __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/service-worker.js');
            });
          }
        `}} />
      </body>
    </html>
  )
}
