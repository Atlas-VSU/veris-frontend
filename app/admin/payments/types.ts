export type PaymentStatus = "pending" | "approved" | "declined"
export type PaymentType = "membership-fee" | "fine"

export interface Payment {
  id: string
  studentId: string
  studentName: string
  type: PaymentType
  amount: number
  referenceCode: string
  receiptImage: string
  status: PaymentStatus
  submittedDate: string
  reviewedDate?: string
  reviewedBy?: string
  remarks?: string
  relatedId?: string
}
