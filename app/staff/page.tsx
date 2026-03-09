'use client'

import { useState, useEffect, useCallback } from 'react'
import { Staff, Schedule } from '@/lib/types'
import DestinationBadge from '@/components/DestinationBadge'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants'

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return {
    month: d.getMonth() + 1,
    day: d.getDate(),
    dayName: DAY_NAMES[d.getDay()],
    isWeekend: d.getDay() === 0 || d.getDay() === 6,
  }
}

export default function StaffPage() {
  const [staffs, setStaffs] = useState<Staff[]>([])
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loadingStaffs, setLoadingStaffs] = useState(true)
  const [loadingSchedules, setLoadingSchedules] = useState(false)

  useEffect(() => {
    fetch('/api/staffs')
      .then(r => r.json())
      .then((data: Staff[]) => {
        // 닉네임 가나다 순 정렬
        setStaffs(data.sort((a, b) => a.nickname.localeCompare(b.nickname, 'ko')))
      })
      .finally(() => setLoadingStaffs(false))
  }, [])

  const fetchSchedules = useCallback(async (staff: Staff) => {
    setLoadingSchedules(true)
    try {
      const res = await fetch(`/api/schedules?staff_id=${staff.id}`)
      if (res.ok) setSchedules(await res.json())
    } finally {
      setLoadingSchedules(false)
    }
  }, [])

  const handleSelectStaff = (staff: Staff) => {
    setSelectedStaff(staff)
    fetchSchedules(staff)
  }

  return (
    <div className="flex flex-col min-h-screen pb-16">
      {/* 헤더 */}
      <header className="px-5 py-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#2D5016' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="5" r="2.5" stroke="white" strokeWidth="1.2"/>
              <path d="M1 12c0-2.5 2.24-4.5 5-4.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
              <circle cx="11" cy="10" r="2" stroke="white" strokeWidth="1.2"/>
              <path d="M9.5 10h3M11 8.5v3" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-stone-800 leading-tight">아트프렌즈</h1>
            <p className="text-[10px] text-stone-400 leading-tight">스탭 스케줄</p>
          </div>
        </div>
      </header>

      {/* 스탭 선택 칩 */}
      <div className="border-b border-stone-100">
        <p className="px-5 pt-4 pb-2 text-xs font-semibold text-stone-400 uppercase tracking-wide">
          스탭 선택
        </p>
        {loadingStaffs ? (
          <div className="px-5 pb-4 flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-16 rounded-full bg-stone-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex gap-2 px-5 pb-4 overflow-x-auto scrollbar-none">
            {staffs.map((staff) => {
              const active = selectedStaff?.id === staff.id
              return (
                <button
                  key={staff.id}
                  onClick={() => handleSelectStaff(staff)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: active ? '#2D5016' : '#F5F3EF',
                    color: active ? '#ffffff' : '#6B7280',
                  }}
                >
                  {staff.nickname}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* 스케줄 리스트 */}
      <div className="flex-1 px-5 py-4">
        {!selectedStaff ? (
          <div className="flex flex-col items-center justify-center h-64 text-stone-400">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className="mb-3 opacity-40">
              <circle cx="18" cy="14" r="7" stroke="#9CA3AF" strokeWidth="1.5"/>
              <path d="M4 38c0-6.627 6.268-12 14-12" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="34" cy="32" r="6" stroke="#9CA3AF" strokeWidth="1.5"/>
              <path d="M31 32h6M34 29v6" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p className="text-sm">스탭을 선택해 주세요</p>
          </div>
        ) : loadingSchedules ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-stone-100 animate-pulse" />
            ))}
          </div>
        ) : schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-stone-400">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className="mb-3 opacity-40">
              <rect x="6" y="8" width="32" height="30" rx="4" stroke="#9CA3AF" strokeWidth="1.5"/>
              <path d="M14 6v4M30 6v4M6 18h32" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p className="text-sm">{selectedStaff.nickname}님의 일정이 없습니다</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-stone-400 mb-3">
              <span className="font-semibold text-stone-700">{selectedStaff.nickname}</span>님의 일정
              <span className="ml-1">({schedules.length}건)</span>
            </p>
            <div className="space-y-2.5">
              {schedules.map((s) => {
                const { month, day, dayName, isWeekend } = formatDate(s.date)
                const destName = s.destinations?.name || '미정'
                const destColor = s.destinations?.color || '#9CA3AF'

                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-4 bg-stone-50 rounded-2xl px-4 py-3.5"
                  >
                    {/* 날짜 */}
                    <div className="flex-shrink-0 text-center w-10">
                      <p
                        className="text-xl font-bold leading-tight"
                        style={{ color: isWeekend ? '#B91C1C' : '#1C1917' }}
                      >
                        {day}
                      </p>
                      <p className="text-[10px] text-stone-400 leading-tight">
                        {month}월 ({dayName})
                      </p>
                    </div>

                    {/* 구분선 */}
                    <div
                      className="w-px self-stretch rounded-full"
                      style={{ backgroundColor: destColor, opacity: 0.4 }}
                    />

                    {/* 내용 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <DestinationBadge name={destName} color={destColor} small />
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${STATUS_COLORS[s.status]}18`,
                            color: STATUS_COLORS[s.status],
                          }}
                        >
                          {STATUS_LABELS[s.status]}
                        </span>
                      </div>
                      {s.note && (
                        <p className="text-xs text-stone-400 mt-1 truncate">{s.note}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
