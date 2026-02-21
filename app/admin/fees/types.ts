export type FeeType = "semester-membership" | "event-fee" | "charity-fee" | "organization-dues"
export type PaymentLogStatus = "pending_verification" | "verified" | "rejected"
export type PaymentMethod = "gcash" | "cash" | "bank-transfer"

export interface Fee {
  id: string
  title: string
  description?: string
  type: FeeType
  amount: number
  academicYear: string
  semester: string
  createdAt: string
  totalStudents: number
  paidCount: number
}

export interface PaymentLog {
  id: string
  feeId: string
  feeName: string
  studentId: string
  studentName: string
  status: PaymentLogStatus
  amountPaid: number
  paymentMethod: PaymentMethod
  gcashReferenceNumber?: string
  receiptImage: string
  paidAt: string
  verifiedBy?: string
  verifiedAt?: string
  rejectionReason?: string
}
