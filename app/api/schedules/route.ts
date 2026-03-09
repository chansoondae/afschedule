import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get('year')
  const month = searchParams.get('month')
  const staffId = searchParams.get('staff_id')

  // 스탭별 전체 일정 조회
  if (staffId) {
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        staffs (id, nickname),
        destinations (id, name, color)
      `)
      .eq('staff_id', staffId)
      .order('date', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
  }

  if (!year || !month) {
    return NextResponse.json({ error: 'year and month are required' }, { status: 400 })
  }

  const startDate = `${year}-${month.padStart(2, '0')}-01`
  const endDate = new Date(parseInt(year), parseInt(month), 0)
    .toISOString()
    .split('T')[0]

  const { data, error } = await supabase
    .from('schedules')
    .select(`
      *,
      staffs (id, nickname),
      destinations (id, name, color)
    `)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { date, destination_id, staff_ids, status, note } = body

  if (!date || !staff_ids || staff_ids.length === 0) {
    return NextResponse.json({ error: 'date and staff_ids are required' }, { status: 400 })
  }

  const inserts = staff_ids.map((staff_id: string) => ({
    date,
    destination_id: destination_id || null,
    staff_id,
    status: status || 'available',
    note: note || null,
  }))

  const { data, error } = await supabase
    .from('schedules')
    .insert(inserts)
    .select(`
      *,
      staffs (id, nickname),
      destinations (id, name, color)
    `)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
