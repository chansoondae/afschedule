export interface Staff {
  id: string
  nickname: string
  created_at: string
}

export interface Destination {
  id: string
  name: string
  color: string
  created_at: string
}

export interface Schedule {
  id: string
  date: string
  destination_id: string | null
  staff_id: string
  status: 'available' | 'confirmed' | 'cancelled'
  note: string | null
  nights: number | null
  created_at: string
  updated_at: string
  staffs?: Staff
  destinations?: Destination | null
}

export interface SchedulesByDate {
  [date: string]: Schedule[]
}
