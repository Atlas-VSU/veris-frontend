import type { Clearance } from "./types"
import { fines } from "../fines/mock-data"
import { membershipFees } from "../membership-fees/mock-data"
import { eventAttendance } from "../events/mock-data"

// Clearances represent a student's overall compliance status for academic purposes.
// Requirements are checked against actual data:
// - "Membership Fee": Student must have paid membership fee (status "paid")
// - "Fines": Student must have no unpaid fines (all fines "paid" or "waived")
// - "Event Attendance (Min. 3)": Student must attend at least 3 events
// - "Community Service": Separate tracking (not shown in this mock)
export const clearances: Clearance[] = [
  { id: "c1", studentId: "2024-00101", studentName: "Maria Santos", academicYear: "2024-2025", semester: "1st Semester", overallStatus: "cleared", requirements: [
    { name: "Membership Fee", status: "cleared" }, { name: "Fines", status: "cleared" }, { name: "Event Attendance (Min. 3)", status: "cleared" }, { name: "Community Service", status: "cleared" },
  ]},
  { id: "c2", studentId: "2024-00102", studentName: "Juan Dela Cruz", academicYear: "2024-2025", semester: "1st Semester", overallStatus: "cleared", requirements: [
    { name: "Membership Fee", status: "cleared" }, { name: "Fines", status: "cleared" }, { name: "Event Attendance (Min. 3)", status: "cleared" }, { name: "Community Service", status: "pending" },
  ]},
  { id: "c3", studentId: "2024-00103", studentName: "Angela Reyes", academicYear: "2024-2025", semester: "1st Semester", overallStatus: "not-cleared", requirements: [
    { name: "Membership Fee", status: "cleared" }, { name: "Fines", status: "not-cleared" }, { name: "Event Attendance (Min. 3)", status: "pending" }, { name: "Community Service", status: "pending" },
  ]},
  { id: "c4", studentId: "2024-00105", studentName: "Patricia Navarro", academicYear: "2024-2025", semester: "1st Semester", overallStatus: "pending", requirements: [
    { name: "Membership Fee", status: "cleared" }, { name: "Fines", status: "not-cleared" }, { name: "Event Attendance (Min. 3)", status: "cleared" }, { name: "Community Service", status: "cleared" },
  ]},
  { id: "c5", studentId: "2024-00106", studentName: "Miguel Torres", academicYear: "2024-2025", semester: "1st Semester", overallStatus: "pending", requirements: [
    { name: "Membership Fee", status: "pending" }, { name: "Fines", status: "cleared" }, { name: "Event Attendance (Min. 3)", status: "cleared" }, { name: "Community Service", status: "cleared" },
  ]},
  { id: "c6", studentId: "2024-00108", studentName: "Rafael Mendoza", academicYear: "2024-2025", semester: "1st Semester", overallStatus: "cleared", requirements: [
    { name: "Membership Fee", status: "cleared" }, { name: "Fines", status: "cleared" }, { name: "Event Attendance (Min. 3)", status: "cleared" }, { name: "Community Service", status: "cleared" },
  ]},
  { id: "c7", studentId: "2024-00109", studentName: "Isabelle Cruz", academicYear: "2024-2025", semester: "1st Semester", overallStatus: "not-cleared", requirements: [
    { name: "Membership Fee", status: "cleared" }, { name: "Fines", status: "not-cleared" }, { name: "Event Attendance (Min. 3)", status: "pending" }, { name: "Community Service", status: "pending" },
  ]},
  { id: "c8", studentId: "2024-00110", studentName: "Daniel Villanueva", academicYear: "2024-2025", semester: "1st Semester", overallStatus: "not-cleared", requirements: [
    { name: "Membership Fee", status: "not-cleared" }, { name: "Fines", status: "not-cleared" }, { name: "Event Attendance (Min. 3)", status: "not-cleared" }, { name: "Community Service", status: "not-cleared" },
  ]},
  { id: "c9", studentId: "2024-00111", studentName: "Camille Fernandez", academicYear: "2024-2025", semester: "1st Semester", overallStatus: "cleared", requirements: [
    { name: "Membership Fee", status: "cleared" }, { name: "Fines", status: "cleared" }, { name: "Event Attendance (Min. 3)", status: "cleared" }, { name: "Community Service", status: "cleared" },
  ]},
  { id: "c10", studentId: "2024-00113", studentName: "Bianca Rivera", academicYear: "2024-2025", semester: "1st Semester", overallStatus: "cleared", requirements: [
    { name: "Membership Fee", status: "cleared" }, { name: "Fines", status: "cleared" }, { name: "Event Attendance (Min. 3)", status: "cleared" }, { name: "Community Service", status: "cleared" },
  ]},
]

// ── Helper: Clearance Requirement Checkers ────────────────────────

/** Check if a student's membership fee requirement is cleared (has paid membership fee) */
export function checkMembershipFeeCleared(studentId: string): boolean {
  const studentFees = membershipFees.filter(f => f.studentId === studentId)
  return studentFees.some(f => f.status === "paid")
}

/** Check if a student's fines requirement is cleared (no unpaid fines) */
export function checkFinesCleared(studentId: string): boolean {
  const studentFines = fines.filter(f => f.studentId === studentId)
  return !studentFines.some(f => f.status === "unpaid")
}

/** Check if a student's event attendance requirement is met (at least minAttendance events) */
export function checkEventAttendanceCleared(studentId: string, minAttendance: number = 3): boolean {
  const studentAttendance = eventAttendance.filter(a => a.studentId === studentId && a.status === "present")
  return studentAttendance.length >= minAttendance
}

/** Get the overall clearance status based on all requirements */
export function getOverallClearanceStatus(requirements: { status: string }[]): "cleared" | "not-cleared" | "pending" {
  const allCleared = requirements.every(r => r.status === "cleared")
  const anyNotCleared = requirements.some(r => r.status === "not-cleared")
  return allCleared ? "cleared" : anyNotCleared ? "not-cleared" : "pending"
}
