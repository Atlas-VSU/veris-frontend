import type { Event, EventAttendance } from "./types"

export const events: Event[] = [
  {
    id: "e1",
    name: "State of the Student Address: The Student Assembly",
    date: "2026-03-11",
    majorEvent: true,
    timeInStart: "08:00",
    timeInEnd: "09:00",
    timeOutStart: "17:00",
    timeOutEnd: "18:00",
    location: "University GYM",
    note: "Attendance is mandatory for all USSC members.",
    attendees: 156,
    status: "completed",
  },
  {
    id: "e2",
    name: "CS3 Assembly and Orientation",
    date: "2026-02-16",
    majorEvent: false,
    timeInStart: "14:00",
    timeInEnd: "15:00",
    timeOutStart: "17:00",
    timeOutEnd: "18:00",
    location: "DCST ICT - Room 101",
    note: "Attendance is mandatory for all CS3 members.",
    attendees: 156,
    status: "completed",
  },
]

export const eventAttendance: EventAttendance[] = [
  { id: "ea1", eventId: "e1", eventName: "State of the Student Address 2nd Semester A.Y. 2025-2026", studentId: "22-1-00123", studentName: "Maria Santos", status: "present", timeIn: "08:05" },
  { id: "ea2", eventId: "e1", eventName: "State of the Student Address 2nd Semester A.Y. 2025-2026", studentId: "22-1-00102", studentName: "Juan Dela Cruz", status: "present", timeIn: "08:20" },
  { id: "ea3", eventId: "e1", eventName: "State of the Student Address 2nd Semester A.Y. 2025-2026", studentId: "22-1-00103", studentName: "Angela Reyes", status: "absent" },
  { id: "ea4", eventId: "e1", eventName: "State of the Student Address 2nd Semester A.Y. 2025-2026", studentId: "22-1-00105", studentName: "Patricia Navarro", status: "present", timeIn: "08:00" },
  { id: "ea5", eventId: "e1", eventName: "State of the Student Address 2nd Semester A.Y. 2025-2026", studentId: "22-1-00106", studentName: "Miguel Torres", status: "excused" },
]
