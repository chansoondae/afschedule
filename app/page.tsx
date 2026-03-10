'use client'

import { useState, useEffect, useCallback } from 'react'
import Calendar from '@/components/Calendar'
import BottomSheet from '@/components/BottomSheet'
import ScheduleForm from '@/components/ScheduleForm'
import MonthStats from '@/components/MonthStats'
import { Schedule, Staff, Destination, SchedulesByDate } from '@/lib/types'

export default function Home() {
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(4)
  const [schedulesByDate, setSchedulesByDate] = useState<SchedulesByDate>({})
  const [staffs, setStaffs] = useState<Staff[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  // 바텀시트
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSchedules, setSelectedSchedules] = useState<Schedule[]>([])

  // 일정 폼
  const [showForm, setShowForm] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [formDate, setFormDate] = useState('')

  const fetchSchedules = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/schedules?year=${year}&month=${month}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data: Schedule[] = await res.json()

      const byDate: SchedulesByDate = {}
      for (const s of data) {
        if (!byDate[s.date]) byDate[s.date] = []
        byDate[s.date].push(s)
      }
      setSchedulesByDate(byDate)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [year, month])

  const fetchMasterData = useCallback(async () => {
    try {
      const [staffRes, destRes] = await Promise.all([
        fetch('/api/staffs'),
        fetch('/api/destinations'),
      ])
      if (staffRes.ok) setStaffs(await staffRes.json())
      if (destRes.ok) setDestinations(await destRes.json())
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    fetchMasterData()
  }, [fetchMasterData])

  useEffect(() => {
    fetchSchedules()
  }, [fetchSchedules])

  const handlePrevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
  }

  const handleNextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
  }

  const handleDateClick = (date: string, schedules: Schedule[]) => {
    setSelectedDate(date)
    setSelectedSchedules(schedules)
  }

  const handleCloseBottomSheet = () => {
    setSelectedDate(null)
    setSelectedSchedules([])
  }

  const handleAddSchedule = () => {
    setEditingSchedule(null)
    setFormDate(selectedDate || '')
    setShowForm(true)
  }

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setFormDate(schedule.date)
    setShowForm(true)
  }

  const handleSave = async (formData: {
    date: string
    destination_id: string | null
    staff_ids: string[]
    status: 'available' | 'confirmed' | 'cancelled'
    note: string
    nights: number | null
  }) => {
    if (editingSchedule) {
      await fetch(`/api/schedules/${editingSchedule.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination_id: formData.destination_id,
          status: formData.status,
          note: formData.note,
          nights: formData.nights,
        }),
      })
    } else {
      await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
    }
    await fetchSchedules()
    // 바텀시트 날짜 업데이트
    if (selectedDate) {
      const res = await fetch(`/api/schedules?year=${year}&month=${month}`)
      if (res.ok) {
        const data: Schedule[] = await res.json()
        const updated = data.filter(s => s.date === selectedDate)
        setSelectedSchedules(updated)
      }
    }
  }

  const handleDelete = async () => {
    if (!editingSchedule) return
    await fetch(`/api/schedules/${editingSchedule.id}`, { method: 'DELETE' })
    await fetchSchedules()
    if (selectedDate) {
      const res = await fetch(`/api/schedules?year=${year}&month=${month}`)
      if (res.ok) {
        const data: Schedule[] = await res.json()
        const updated = data.filter(s => s.date === selectedDate)
        setSelectedSchedules(updated)
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen pb-16">
        {/* 앱 헤더 */}
        <header className="px-5 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#2D5016' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="2" width="12" height="11" rx="2" stroke="white" strokeWidth="1.2"/>
                <path d="M4 1v2M10 1v2M1 6h12" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-stone-800 leading-tight">아트프렌즈</h1>
              <p className="text-[10px] text-stone-400 leading-tight">아트버스 스케줄</p>
            </div>
          </div>
        </header>

        {/* 캘린더 */}
        <main className="relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
              <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
            </div>
          )}
          <Calendar
            year={year}
            month={month}
            schedulesByDate={schedulesByDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onDateClick={handleDateClick}
          />
        </main>

        {/* 월간 통계 */}
        <MonthStats schedulesByDate={schedulesByDate} />

        {/* 바텀시트 */}
        {selectedDate && (
          <BottomSheet
            date={selectedDate}
            schedules={selectedSchedules}
            onClose={handleCloseBottomSheet}
            onAddSchedule={handleAddSchedule}
            onEditSchedule={handleEditSchedule}
          />
        )}

        {/* 일정 폼 */}
        {showForm && (
          <ScheduleForm
            date={formDate}
            schedule={editingSchedule}
            staffs={staffs}
            destinations={destinations}
            onSave={handleSave}
            onDelete={editingSchedule ? handleDelete : undefined}
            onClose={() => setShowForm(false)}
          />
        )}
    </div>
  )
}
