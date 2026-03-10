'use client'

import { SchedulesByDate } from '@/lib/types'

interface MonthStatsProps {
  schedulesByDate: SchedulesByDate
}

const SEATS_PER_BUS = 28

export default function MonthStats({ schedulesByDate }: MonthStatsProps) {
  const dates = Object.keys(schedulesByDate)

  const totalDays = dates.length
  const totalBuses = dates.reduce((sum, date) => sum + schedulesByDate[date].length, 0)
  const totalPeople = totalBuses * SEATS_PER_BUS

  if (totalDays === 0) return null

  const stats = [
    {
      label: '출발 날짜',
      value: totalDays,
      unit: '일',
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="2" width="12" height="11" rx="2" stroke="#2D5016" strokeWidth="1.2"/>
          <path d="M4 1v2M10 1v2M1 6h12" stroke="#2D5016" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: '총 버스',
      value: totalBuses,
      unit: '대',
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="4" width="12" height="8" rx="1.5" stroke="#2D5016" strokeWidth="1.2"/>
          <path d="M1 7h12" stroke="#2D5016" strokeWidth="1.2"/>
          <circle cx="3.5" cy="12" r="1" fill="#2D5016"/>
          <circle cx="10.5" cy="12" r="1" fill="#2D5016"/>
          <path d="M4 4V3a3 3 0 0 1 6 0v1" stroke="#2D5016" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: '총 인원',
      value: totalPeople.toLocaleString(),
      unit: '명',
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="5" cy="4" r="2" stroke="#2D5016" strokeWidth="1.2"/>
          <path d="M1 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#2D5016" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="10.5" cy="4.5" r="1.5" stroke="#2D5016" strokeWidth="1.2"/>
          <path d="M12.5 12c0-1.7-1-3-2.5-3" stroke="#2D5016" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="mx-4 my-4 rounded-2xl overflow-hidden border border-stone-100">
      <div className="flex divide-x divide-stone-100">
        {stats.map((s) => (
          <div key={s.label} className="flex-1 flex flex-col items-center justify-center py-4 gap-1">
            <div className="flex items-center gap-1.5">
              {s.icon}
              <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wide">{s.label}</span>
            </div>
            <p className="text-2xl font-bold leading-tight" style={{ color: '#2D5016' }}>
              {s.value}
              <span className="text-sm font-normal text-stone-400 ml-0.5">{s.unit}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
