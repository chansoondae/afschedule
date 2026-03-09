'use client'

import { Schedule, SchedulesByDate } from '@/lib/types'
import CalendarCell from './CalendarCell'
import MonthNav from './MonthNav'

interface CalendarProps {
  year: number
  month: number
  schedulesByDate: SchedulesByDate
  onPrevMonth: () => void
  onNextMonth: () => void
  onDateClick: (date: string, schedules: Schedule[]) => void
}

const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토']

export default function Calendar({
  year,
  month,
  schedulesByDate,
  onPrevMonth,
  onNextMonth,
  onDateClick,
}: CalendarProps) {
  const today = new Date().toISOString().split('T')[0]

  // 해당 월의 첫 번째 날 (요일 인덱스)
  const firstDay = new Date(year, month - 1, 1).getDay()
  // 해당 월의 마지막 날
  const lastDate = new Date(year, month, 0).getDate()

  // 캘린더 그리드 생성 (6주 × 7일 = 42칸)
  const cells: { day: number | null; date: string | null }[] = []

  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: null, date: null })
  }
  for (let d = 1; d <= lastDate; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, date: dateStr })
  }
  // 마지막 주 채우기
  while (cells.length % 7 !== 0) {
    cells.push({ day: null, date: null })
  }

  const weeks: { day: number | null; date: string | null }[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }

  return (
    <div className="flex flex-col">
      <MonthNav year={year} month={month} onPrev={onPrevMonth} onNext={onNextMonth} />

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 border-b border-stone-100">
        {DAYS_OF_WEEK.map((d, i) => (
          <div
            key={d}
            className={`text-center py-2 text-xs font-medium
              ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-stone-400'}
            `}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 캘린더 그리드 */}
      <div className="divide-y divide-stone-100">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 divide-x divide-stone-100">
            {week.map((cell, di) => {
              const schedules = cell.date ? (schedulesByDate[cell.date] || []) : []
              return (
                <CalendarCell
                  key={`${wi}-${di}`}
                  day={cell.day}
                  date={cell.date}
                  schedules={schedules}
                  isToday={cell.date === today}
                  isCurrentMonth={cell.day !== null}
                  onClick={() => {
                    if (cell.date) onDateClick(cell.date, schedules)
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
