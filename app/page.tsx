import type { Metadata } from 'next'
import CalendarClientWrapper from './CalendarClient'

interface Props {
  searchParams: Promise<{ year?: string; month?: string }>
}

const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { year, month } = await searchParams
  const y = year || '2026'
  const m = parseInt(month || '4')
  const monthName = MONTH_NAMES[m - 1]

  const title = `${y}년 ${monthName} 🚌 아트버스 스케줄 | 아트프렌즈`
  const description = `아트프렌즈 ${y}년 ${monthName} 아트버스 운행 일정을 확인하세요.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default function Home() {
  return <CalendarClientWrapper />
}
