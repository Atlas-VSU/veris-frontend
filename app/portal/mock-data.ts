import { students } from "../admin/students/mock-data"
import { fines, studentFineRecords } from "../admin/fines/mock-data"
import { clearances } from "../admin/clearance/mock-data"
import { events, eventAttendance } from "../admin/events/mock-data"
import { fees, paymentLogs } from "../admin/fees/mock-data"

// Change index to test different students (default: Angela Reyes)
export const currentStudent = students[2]

export const currentStudentFees = fees
export const currentStudentPaymentLogs = paymentLogs.filter(
  l => l.studentId === currentStudent.studentId
)
export const currentStudentFines = fines.filter(f => f.studentId === currentStudent.studentId)
export const currentStudentFineRecord = studentFineRecords.find(r => r.studentId === currentStudent.studentId) ?? null
export const currentStudentClearance = clearances.find(c => c.studentId === currentStudent.studentId)
export const currentStudentAttendance = eventAttendance.filter(a => a.studentId === currentStudent.studentId)

export { events, fees }

export const GCASH_QR_CODE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" // Placeholder QR code
export const GCASH_ACCOUNT_NAME = "University Supreme Student Council"
export const GCASH_ACCOUNT_NUMBER = "09123456789"
