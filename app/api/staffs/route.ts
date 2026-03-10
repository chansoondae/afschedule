import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('staffs')
    .select('*, schedules(count)')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 일정 많은 순 정렬, 동률이면 가나다 순
  const sorted = (data ?? []).sort((a, b) => {
    const countA = (a.schedules?.[0]?.count ?? 0) as number
    const countB = (b.schedules?.[0]?.count ?? 0) as number
    if (countB !== countA) return countB - countA
    return a.nickname.localeCompare(b.nickname, 'ko')
  })

  return NextResponse.json(sorted)
}
