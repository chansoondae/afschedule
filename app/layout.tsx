import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '아트프렌즈 아트버스 캘린더',
  description: '아트프렌즈 스탭 아트버스 운행 일정 관리',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen" style={{ backgroundColor: '#F8F6F0' }}>
        {children}
      </body>
    </html>
  )
}
