'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Calendar from '@/components/Calendar'
import BottomSheet from '@/components/BottomSheet'
import ScheduleForm from '@/components/ScheduleForm'
import MonthStats from '@/components/MonthStats'
import { Schedule, Staff, Destination, SchedulesByDate } from '@/lib/types'

export default function CalendarClientWrapper() {
  return (
    <Suspense>
      <CalendarClient />
    </Suspense>
  )
}

function CalendarClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const yearParam = parseInt(searchParams.get('year') || '2026')
  const monthParam = parseInt(searchParams.get('month') || '4')

  const [year, setYear] = useState(yearParam)
  const [month, setMonth] = useState(monthParam)
  const [schedulesByDate, setSchedulesByDate] = useState<SchedulesByDate>({})
  const [staffs, setStaffs] = useState<Staff[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSchedules, setSelectedSchedules] = useState<Schedule[]>([])

  const [showForm, setShowForm] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [formDate, setFormDate] = useState('')

  const updateURL = useCallback((y: number, m: number) => {
    router.replace(`/?year=${y}&month=${m}`, { scroll: false })
  }, [router])

  const fetchSchedules = useCallback(async (y: number, m: number) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/schedules?year=${y}&month=${m}`)
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
  }, [])

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

  useEffect(() => { fetchMasterData() }, [fetchMasterData])
  useEffect(() => { fetchSchedules(year, month) }, [year, month, fetchSchedules])

  const handlePrevMonth = () => {
    const newYear = month === 1 ? year - 1 : year
    const newMonth = month === 1 ? 12 : month - 1
    setYear(newYear)
    setMonth(newMonth)
    updateURL(newYear, newMonth)
  }

  const handleNextMonth = () => {
    const newYear = month === 12 ? year + 1 : year
    const newMonth = month === 12 ? 1 : month + 1
    setYear(newYear)
    setMonth(newMonth)
    updateURL(newYear, newMonth)
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
    await fetchSchedules(year, month)
    if (selectedDate) {
      const res = await fetch(`/api/schedules?year=${year}&month=${month}`)
      if (res.ok) {
        const data: Schedule[] = await res.json()
        setSelectedSchedules(data.filter(s => s.date === selectedDate))
      }
    }
  }

  const handleDelete = async () => {
    if (!editingSchedule) return
    await fetch(`/api/schedules/${editingSchedule.id}`, { method: 'DELETE' })
    await fetchSchedules(year, month)
    if (selectedDate) {
      const res = await fetch(`/api/schedules?year=${year}&month=${month}`)
      if (res.ok) {
        const data: Schedule[] = await res.json()
        setSelectedSchedules(data.filter(s => s.date === selectedDate))
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen pb-16">
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

      <MonthStats schedulesByDate={schedulesByDate} />

      {selectedDate && (
        <BottomSheet
          date={selectedDate}
          schedules={selectedSchedules}
          onClose={handleCloseBottomSheet}
          onAddSchedule={handleAddSchedule}
          onEditSchedule={handleEditSchedule}
        />
      )}

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
