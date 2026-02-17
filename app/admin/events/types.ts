export type EventType = "general-assembly" | "seminar" | "workshop" | "social" | "meeting"
export type AttendanceStatus = "present" | "absent" | "excused"

export interface Event {
  id: string
  name: string
  description: string
  date: string
  location: string
  type: EventType
  attendeesCount: number
  totalStudents: number
}

export interface EventAttendance {
  id: string
  eventId: string
  eventName: string
  studentId: string
  studentName: string
  status: AttendanceStatus
  timeIn?: string
}
