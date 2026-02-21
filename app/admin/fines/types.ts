export type StudentFineStatus = "pending" | "partial" | "paid"
export type PaymentSubmissionStatus = "pending" | "approved" | "declined"
export type AppealStatus = "pending" | "approved" | "rejected"

export interface PaymentSubmission {
  id: string
  receiptImage: string
  amountPaid: number
  paymentMethod: string
  gcashReferenceNumber?: string
  dateOfPayment: string
  status: PaymentSubmissionStatus
  rejectionReason?: string
}

export interface AppealInfo {
  notes: string
  appealedAt: string
  status: AppealStatus
  resolvedBy?: string
  resolvedAt?: string
}

export interface FineItem {
  id: string
  itemNumber: number
  fineTypeCode: string
  fineTypeName: string
  eventName?: string
  eventDate?: string
  amount: number
  reason: string
  timeViolation?: string
  issuedBy: string
  issuedAt: string
  isWaived: boolean
  waivedBy?: string
  waivedAt?: string
  waivedReason?: string
  appeal?: AppealInfo
}

// One bulk submission covers ALL non-waived fines for the student — submitted once at end of semester.
export interface StudentFineRecord {
  studentId: string
  studentName: string
  fineItems: FineItem[]
  bulkPaymentSubmission?: PaymentSubmission
}
