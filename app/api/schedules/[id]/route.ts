import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { destination_id, status, note } = body

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (destination_id !== undefined) updates.destination_id = destination_id
  if (status !== undefined) updates.status = status
  if (note !== undefined) updates.note = note

  const { data, error } = await supabase
    .from('schedules')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      staffs (id, nickname),
      destinations (id, name, color)
    `)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { error } = await supabase
    .from('schedules')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
