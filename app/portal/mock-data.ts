import { students } from "../admin/students/mock-data"
import { membershipFees } from "../admin/membership-fees/mock-data"
import { fines } from "../admin/fines/mock-data"
import { clearances } from "../admin/clearance/mock-data"
import { events, eventAttendance } from "../admin/events/mock-data"
import { payments } from "../admin/payments/mock-data"

// Change index to test different students (default: Angela Reyes)
export const currentStudent = students[2]

export const currentStudentFees = membershipFees.filter(f => f.studentId === currentStudent.studentId)
export const currentStudentFines = fines.filter(f => f.studentId === currentStudent.studentId)
export const currentStudentClearance = clearances.find(c => c.studentId === currentStudent.studentId)
export const currentStudentAttendance = eventAttendance.filter(a => a.studentId === currentStudent.studentId)
export const currentStudentPayments = payments.filter(p => p.studentId === currentStudent.studentId)

export { events }

export const GCASH_QR_CODE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" // Placeholder QR code
export const GCASH_ACCOUNT_NAME = "University Supreme Student Council"
export const GCASH_ACCOUNT_NUMBER = "09123456789"
