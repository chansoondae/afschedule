'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  {
    href: '/',
    label: '캘린더',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="3" width="18" height="17" rx="3" stroke={active ? '#2D5016' : '#9CA3AF'} strokeWidth="1.5"/>
        <path d="M7 2v3M15 2v3M2 9h18" stroke={active ? '#2D5016' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="6" y="13" width="3" height="3" rx="0.5" fill={active ? '#2D5016' : '#9CA3AF'}/>
        <rect x="12" y="13" width="3" height="3" rx="0.5" fill={active ? '#2D5016' : '#9CA3AF'}/>
      </svg>
    ),
  },
  {
    href: '/staff',
    label: '스탭',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="9" cy="7" r="3.5" stroke={active ? '#2D5016' : '#9CA3AF'} strokeWidth="1.5"/>
        <path d="M2 18c0-3.314 3.134-6 7-6" stroke={active ? '#2D5016' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="16" cy="14" r="3" stroke={active ? '#2D5016' : '#9CA3AF'} strokeWidth="1.5"/>
        <path d="M13.5 14h5M16 11.5v5" stroke={active ? '#2D5016' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-stone-100 z-30">
      <div className="flex">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors"
            >
              {item.icon(active)}
              <span
                className="text-[10px] font-medium"
                style={{ color: active ? '#2D5016' : '#9CA3AF' }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
      {/* 홈 인디케이터 여백 (iOS) */}
      <div className="h-safe-bottom" />
    </nav>
  )
}
