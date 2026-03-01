export type EventStatus = "ongoing" | "upcoming" | "completed" | "archived"
export type AttendanceStatus = "present" | "absent" | "excused"

export interface Event {
  id: string
  name: string
  date: string
  majorEvent?: boolean
  timeInStart?: string | null
  timeInEnd?: string | null
  timeOutStart?: string | null
  timeOutEnd?: string | null
  location: string
  note: string
  attendees: number
  status: EventStatus
}

export interface EventAttendance {
  eventName: string
  id: string
  eventId: string
  studentId: string
  studentName: string
  status: AttendanceStatus
  timeIn?: string
}
