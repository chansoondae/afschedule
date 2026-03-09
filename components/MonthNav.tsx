'use client'

interface MonthNavProps {
  year: number
  month: number
  onPrev: () => void
  onNext: () => void
}

export default function MonthNav({ year, month, onPrev, onNext }: MonthNavProps) {
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월',
  ]

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <button
        onClick={onPrev}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-stone-100 active:bg-stone-200 transition-colors"
        aria-label="이전 달"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="text-center">
        <p className="text-xs text-stone-400 font-light">{year}</p>
        <h2 className="text-xl font-semibold text-stone-800 leading-tight">{monthNames[month - 1]}</h2>
      </div>

      <button
        onClick={onNext}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-stone-100 active:bg-stone-200 transition-colors"
        aria-label="다음 달"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7.5 15L12.5 10L7.5 5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
