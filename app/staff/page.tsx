import type { Metadata } from 'next'
import StaffClientWrapper from './StaffClient'

interface Props {
  searchParams: Promise<{ name?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { name } = await searchParams

  if (name) {
    return {
      title: `${name} | 아트프렌즈 스케줄`,
      description: `${name}님의 아트버스 스케줄을 확인하세요.`,
      openGraph: {
        title: `${name} | 아트프렌즈 스케줄`,
        description: `${name}님의 아트버스 스케줄을 확인하세요.`,
      },
    }
  }

  return {
    title: '스탭 스케줄 | 아트프렌즈',
    description: '아트프렌즈 스탭별 아트버스 운행 일정',
    openGraph: {
      title: '스탭 스케줄 | 아트프렌즈',
      description: '아트프렌즈 스탭별 아트버스 운행 일정',
    },
  }
}

export default function StaffPage() {
  return <StaffClientWrapper />
}
