import type { Event, EventAttendance } from "./types"

export const events: Event[] = [
  { id: "e1", name: "General Assembly 2024", description: "Annual general assembly for all USSC members. Attendance is mandatory.", date: "2024-09-15", location: "University Auditorium", type: "general-assembly", attendeesCount: 156, totalStudents: 200 },
  { id: "e2", name: "Leadership Seminar", description: "Seminar on student leadership and governance.", date: "2024-10-05", location: "Conference Hall A", type: "seminar", attendeesCount: 89, totalStudents: 120 },
  { id: "e3", name: "Tech Workshop: Web Dev", description: "Hands-on workshop on modern web development technologies.", date: "2024-10-20", location: "Computer Lab 3", type: "workshop", attendeesCount: 45, totalStudents: 50 },
  { id: "e4", name: "USSC Welcome Party", description: "Welcome party for new members and freshmen.", date: "2024-08-30", location: "University Grounds", type: "social", attendeesCount: 178, totalStudents: 200 },
  { id: "e5", name: "Budget Planning Meeting", description: "Quarterly budget review and planning session.", date: "2024-11-10", location: "Meeting Room 2", type: "meeting", attendeesCount: 12, totalStudents: 15 },
  { id: "e6", name: "Community Outreach", description: "Community service and outreach program.", date: "2024-11-25", location: "Barangay Hall", type: "social", attendeesCount: 67, totalStudents: 80 },
]

export const eventAttendance: EventAttendance[] = [
  { id: "ea1", eventId: "e1", eventName: "General Assembly 2024", studentId: "2024-00101", studentName: "Maria Santos", status: "present", timeIn: "08:30" },
  { id: "ea2", eventId: "e1", eventName: "General Assembly 2024", studentId: "2024-00102", studentName: "Juan Dela Cruz", status: "present", timeIn: "08:45" },
  { id: "ea3", eventId: "e1", eventName: "General Assembly 2024", studentId: "2024-00103", studentName: "Angela Reyes", status: "absent" },
  { id: "ea4", eventId: "e1", eventName: "General Assembly 2024", studentId: "2024-00105", studentName: "Patricia Navarro", status: "present", timeIn: "08:15" },
  { id: "ea5", eventId: "e1", eventName: "General Assembly 2024", studentId: "2024-00106", studentName: "Miguel Torres", status: "excused" },
  { id: "ea6", eventId: "e2", eventName: "Leadership Seminar", studentId: "2024-00101", studentName: "Maria Santos", status: "present", timeIn: "09:00" },
  { id: "ea7", eventId: "e2", eventName: "Leadership Seminar", studentId: "2024-00108", studentName: "Rafael Mendoza", status: "present", timeIn: "09:10" },
  { id: "ea8", eventId: "e2", eventName: "Leadership Seminar", studentId: "2024-00109", studentName: "Isabelle Cruz", status: "absent" },
  { id: "ea9", eventId: "e3", eventName: "Tech Workshop: Web Dev", studentId: "2024-00101", studentName: "Maria Santos", status: "present", timeIn: "13:00" },
  { id: "ea10", eventId: "e3", eventName: "Tech Workshop: Web Dev", studentId: "2024-00102", studentName: "Juan Dela Cruz", status: "present", timeIn: "13:05" },
  { id: "ea11", eventId: "e3", eventName: "Tech Workshop: Web Dev", studentId: "2024-00114", studentName: "Enrique Castillo", status: "present", timeIn: "12:55" },
  { id: "ea12", eventId: "e4", eventName: "USSC Welcome Party", studentId: "2024-00101", studentName: "Maria Santos", status: "present", timeIn: "17:00" },
  { id: "ea13", eventId: "e4", eventName: "USSC Welcome Party", studentId: "2024-00105", studentName: "Patricia Navarro", status: "present", timeIn: "17:15" },
  { id: "ea14", eventId: "e4", eventName: "USSC Welcome Party", studentId: "2024-00113", studentName: "Bianca Rivera", status: "present", timeIn: "17:30" },
  { id: "ea15", eventId: "e6", eventName: "Community Outreach", studentId: "2024-00101", studentName: "Maria Santos", status: "present", timeIn: "07:00" },
  { id: "ea16", eventId: "e6", eventName: "Community Outreach", studentId: "2024-00106", studentName: "Miguel Torres", status: "present", timeIn: "07:10" },
]
