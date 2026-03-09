'use client'

import { Schedule } from '@/lib/types'

interface CalendarCellProps {
  day: number | null
  date: string | null
  schedules: Schedule[]
  isToday: boolean
  isCurrentMonth: boolean
  onClick: () => void
}

export default function CalendarCell({
  day,
  date,
  schedules,
  isToday,
  isCurrentMonth,
  onClick,
}: CalendarCellProps) {
  if (!day || !date) {
    return <div className="min-h-[72px] bg-stone-50/30" />
  }

  // 목적지별 그룹 (색상 도트 + 닉네임 표시용)
  const destinationGroups = schedules.reduce<Record<string, { color: string; name: string; staffs: string[] }>>(
    (acc, s) => {
      const key = s.destinations?.id || 'undecided'
      const name = s.destinations?.name || '미정'
      const color = s.destinations?.color || '#9CA3AF'
      if (!acc[key]) acc[key] = { color, name, staffs: [] }
      if (s.staffs?.nickname) acc[key].staffs.push(s.staffs.nickname)
      return acc
    },
    {}
  )

  const groups = Object.values(destinationGroups)
  const hasSchedule = schedules.length > 0

  return (
    <button
      onClick={onClick}
      className={`min-h-[88px] p-1.5 flex flex-col items-start gap-1 text-left w-full transition-colors border border-transparent
        ${isCurrentMonth ? 'hover:bg-amber-50/60 active:bg-amber-100/60' : 'opacity-40'}
        ${hasSchedule ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      {/* 날짜 숫자 */}
      <div className="flex items-center justify-center w-full mb-0.5">
        <span
          className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-colors
            ${isToday
              ? 'bg-stone-800 text-white'
              : isCurrentMonth
              ? 'text-stone-700'
              : 'text-stone-400'
            }
          `}
        >
          {day}
        </span>
      </div>

      {/* 일정 뱃지 (최대 2개) */}
      <div className="flex flex-col gap-1 w-full">
        {groups.slice(0, 2).map((g) => (
          <div key={g.name} className="flex flex-col gap-0.5">
            {/* 목적지 뱃지 */}
            <div
              className="flex items-center gap-1 rounded px-1 py-0.5"
              style={{ backgroundColor: `${g.color}18` }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: g.color }}
              />
              <span
                className="text-[10px] font-medium truncate leading-tight"
                style={{ color: g.color }}
              >
                {g.name}
              </span>
            </div>
            {/* 닉네임 목록 */}
            <p className="text-[9px] text-stone-400 leading-tight pl-1 truncate">
              {g.staffs.join(', ')}
            </p>
          </div>
        ))}
        {groups.length > 2 && (
          <span className="text-[9px] text-stone-400 pl-1">+{groups.length - 2}개</span>
        )}
      </div>
    </button>
  )
}
