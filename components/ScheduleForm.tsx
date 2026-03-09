'use client'

import { useState, useEffect } from 'react'
import { Schedule, Staff, Destination } from '@/lib/types'
import { STATUS_LABELS } from '@/lib/constants'

interface ScheduleFormProps {
  date: string
  schedule?: Schedule | null
  staffs: Staff[]
  destinations: Destination[]
  defaultStaffIds?: string[]
  onSave: (data: FormData) => Promise<void>
  onDelete?: () => Promise<void>
  onClose: () => void
}

interface FormData {
  date: string
  destination_id: string | null
  staff_ids: string[]
  status: 'available' | 'confirmed' | 'cancelled'
  note: string
}

export default function ScheduleForm({
  date,
  schedule,
  staffs,
  destinations,
  defaultStaffIds,
  onSave,
  onDelete,
  onClose,
}: ScheduleFormProps) {
  const isEdit = !!schedule

  const [formDate, setFormDate] = useState(date)
  const [destinationId, setDestinationId] = useState<string>(
    schedule?.destination_id || ''
  )
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>(
    schedule ? [schedule.staff_id] : (defaultStaffIds ?? [])
  )
  const [status, setStatus] = useState<'available' | 'confirmed' | 'cancelled'>(
    schedule?.status || 'available'
  )
  const [note, setNote] = useState(schedule?.note || '')
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const toggleStaff = (staffId: string) => {
    if (isEdit) return // 수정 모드에서는 스탭 변경 불가
    setSelectedStaffIds(prev =>
      prev.includes(staffId)
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    )
  }

  const handleSubmit = async () => {
    if (!formDate || selectedStaffIds.length === 0) return
    setLoading(true)
    try {
      await onSave({
        date: formDate,
        destination_id: destinationId || null,
        staff_ids: selectedStaffIds,
        status,
        note,
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    if (!deleteConfirm) {
      setDeleteConfirm(true)
      return
    }
    setLoading(true)
    try {
      await onDelete()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-60 flex items-end justify-center pointer-events-none">
        <div
          className="bg-white rounded-t-2xl w-full max-w-[480px] pointer-events-auto shadow-2xl"
          style={{ maxHeight: '92vh' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-stone-200" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-2 pb-4 border-b border-stone-100">
            <h3 className="text-lg font-semibold text-stone-800">
              {isEdit ? '일정 수정' : '일정 추가'}
            </h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 4l10 10M14 4L4 14" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Form */}
          <div className="overflow-y-auto px-5 py-4 space-y-5" style={{ maxHeight: 'calc(92vh - 80px)' }}>
            {/* 날짜 */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">날짜</label>
              <input
                type="date"
                value={formDate}
                onChange={e => setFormDate(e.target.value)}
                disabled={isEdit}
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-300 disabled:bg-stone-50 disabled:text-stone-400"
              />
            </div>

            {/* 목적지 */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">목적지</label>
              <select
                value={destinationId}
                onChange={e => setDestinationId(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white"
              >
                <option value="">미정</option>
                {destinations.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* 스탭 선택 */}
            {!isEdit && (
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">
                  스탭 선택 ({selectedStaffIds.length}명)
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                  {staffs.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleStaff(s.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition-colors
                        ${selectedStaffIds.includes(s.id)
                          ? 'bg-stone-800 text-white'
                          : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                        }`}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0
                        ${selectedStaffIds.includes(s.id)
                          ? 'bg-white/20'
                          : 'border border-stone-300'
                        }`}
                      >
                        {selectedStaffIds.includes(s.id) && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M1.5 5L4 7.5L8.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className="truncate">{s.nickname}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 상태 */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">상태</label>
              <div className="flex gap-2">
                {(['available', 'confirmed', 'cancelled'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors
                      ${status === s
                        ? s === 'available'
                          ? 'bg-stone-800 text-white'
                          : s === 'confirmed'
                          ? 'bg-green-700 text-white'
                          : 'bg-red-600 text-white'
                        : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                      }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            {/* 메모 */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">메모 (선택)</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="메모를 입력하세요..."
                rows={2}
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none placeholder:text-stone-300"
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-2 pb-6 pt-1">
              {isEdit && onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors
                    ${deleteConfirm
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-stone-100 text-red-500 hover:bg-red-50'
                    }`}
                >
                  {deleteConfirm ? '정말 삭제' : '삭제'}
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-3 rounded-xl text-sm font-medium bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || selectedStaffIds.length === 0}
                className="flex-1 py-3 rounded-xl text-sm font-medium bg-stone-800 text-white hover:bg-stone-700 active:bg-stone-900 transition-colors disabled:opacity-40"
              >
                {loading ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
