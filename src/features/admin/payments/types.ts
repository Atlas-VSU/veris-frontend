export type PaymentStatus = "pending" | "approved" | "declined"
export type PaymentType = "membership-fee" | "fine" | "bulk"

export interface PaymentLineItem {
  type: "fee" | "fine"
  referenceId: string   // feeId or fineItem.id
  name: string
  amount: number
}

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
  lineItems?: PaymentLineItem[]
}

export interface UnpaidDue {
  id: string
  type: "fee" | "fine"
  name: string
  amount: number
  referenceId: string
}

export interface StudentUnpaidRecord {
  studentId: string
  studentName: string
  program: string
  yearLevel: number
  dues: UnpaidDue[]
}
