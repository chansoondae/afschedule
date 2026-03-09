'use client'

import { useEffect, useRef } from 'react'
import { Schedule } from '@/lib/types'
import DestinationBadge from './DestinationBadge'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants'

interface BottomSheetProps {
  date: string | null
  schedules: Schedule[]
  onClose: () => void
  onAddSchedule: () => void
  onEditSchedule: (schedule: Schedule) => void
}

export default function BottomSheet({
  date,
  schedules,
  onClose,
  onAddSchedule,
  onEditSchedule,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const isOpen = date !== null

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!date) return null

  // 날짜 포맷
  const d = new Date(date + 'T00:00:00')
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']
  const dateLabel = `${d.getMonth() + 1}월 ${d.getDate()}일 (${dayNames[d.getDay()]})`

  // 목적지별 그룹핑
  const groups: Record<string, { name: string; color: string; schedules: Schedule[] }> = {}
  for (const s of schedules) {
    const key = s.destinations?.id || 'undecided'
    const name = s.destinations?.name || '미정'
    const color = s.destinations?.color || '#9CA3AF'
    if (!groups[key]) groups[key] = { name, color, schedules: [] }
    groups[key].schedules.push(s)
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-2xl z-50 shadow-2xl"
        style={{ maxHeight: '80vh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-stone-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-lg font-semibold text-stone-800">{dateLabel}</h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {schedules.length > 0 ? `일정 ${schedules.length}개` : '일정 없음'}
            </p>
          </div>
          <button
            onClick={onAddSchedule}
            className="flex items-center gap-1.5 bg-stone-800 text-white text-sm px-4 py-2 rounded-full hover:bg-stone-700 active:bg-stone-900 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            일정 추가
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-5 py-4 space-y-4" style={{ maxHeight: 'calc(80vh - 120px)' }}>
          {schedules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-stone-400">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-3 opacity-40">
                <rect x="5" y="8" width="30" height="28" rx="4" stroke="#9CA3AF" strokeWidth="1.5"/>
                <path d="M13 5v6M27 5v6M5 18h30" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="text-sm">이 날은 일정이 없습니다</p>
            </div>
          ) : (
            Object.values(groups).map((g) => (
              <div key={g.name} className="space-y-2">
                <div className="flex items-center gap-2">
                  <DestinationBadge name={g.name} color={g.color} />
                  <span className="text-xs text-stone-400">{g.schedules.length}명</span>
                </div>
                <div className="space-y-1.5 pl-1">
                  {g.schedules.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onEditSchedule(s)}
                      className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl bg-stone-50 hover:bg-stone-100 active:bg-stone-200 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: STATUS_COLORS[s.status] }}
                        />
                        <span className="text-sm font-medium text-stone-700">
                          {s.staffs?.nickname || '알 수 없음'}
                        </span>
                        {s.note && (
                          <span className="text-xs text-stone-400 truncate max-w-[100px]">{s.note}</span>
                        )}
                      </div>
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${STATUS_COLORS[s.status]}18`,
                          color: STATUS_COLORS[s.status],
                        }}
                      >
                        {STATUS_LABELS[s.status]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
