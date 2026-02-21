export type FeeStatus = "paid" | "unpaid" | "partial"

export interface MembershipFee {
  id: string
  studentId: string
  studentName: string
  amount: number
  semester: string
  academicYear: string
  status: FeeStatus
  paidDate?: string
  receiptNo?: string
}
