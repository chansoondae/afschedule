'use client'

import { SchedulesByDate } from '@/lib/types'

interface MonthStatsProps {
  schedulesByDate: SchedulesByDate
}

export default function MonthStats({ schedulesByDate }: MonthStatsProps) {
  const dates = Object.keys(schedulesByDate)

  // 일정이 있는 날짜만 (출발 날짜)
  const totalDays = dates.length

  // 총 버스 대수 = 전체 스케줄 수 (스탭 1명 = 버스 1대)
  const totalBuses = dates.reduce((sum, date) => sum + schedulesByDate[date].length, 0)

  if (totalDays === 0) return null

  return (
    <div className="mx-4 my-4 rounded-2xl overflow-hidden border border-stone-100">
      <div className="flex divide-x divide-stone-100">
        {/* 출발 날짜 */}
        <div className="flex-1 flex flex-col items-center justify-center py-4 gap-1">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="2" width="12" height="11" rx="2" stroke="#2D5016" strokeWidth="1.2"/>
              <path d="M4 1v2M10 1v2M1 6h12" stroke="#2D5016" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wide">출발 날짜</span>
          </div>
          <p className="text-2xl font-bold text-stone-800 leading-tight">
            {totalDays}
            <span className="text-sm font-normal text-stone-400 ml-0.5">일</span>
          </p>
        </div>

        {/* 구분선 장식 */}
        <div className="flex-1 flex flex-col items-center justify-center py-4 gap-1">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="5" width="12" height="7" rx="1.5" stroke="#2D5016" strokeWidth="1.2"/>
              <path d="M3 5V4a2 2 0 0 1 4 0v1" stroke="#2D5016" strokeWidth="1.2" strokeLinecap="round"/>
              <circle cx="4" cy="9" r="1" fill="#2D5016"/>
              <circle cx="10" cy="9" r="1" fill="#2D5016"/>
              <path d="M1 8h12" stroke="#2D5016" strokeWidth="1.2"/>
            </svg>
            <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wide">총 버스</span>
          </div>
          <p className="text-2xl font-bold text-stone-800 leading-tight">
            {totalBuses}
            <span className="text-sm font-normal text-stone-400 ml-0.5">대</span>
          </p>
        </div>
      </div>
    </div>
  )
}
