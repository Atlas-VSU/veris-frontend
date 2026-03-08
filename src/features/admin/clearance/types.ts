export type ClearanceItemStatus = "cleared" | "pending" | "not-cleared"

export interface PendingPaymentDetail {
  method: string
  referenceNo?: string
  amountPaid: number
  submittedAt: string
  coveredItems?: Array<{ reqName?: string; label: string; amount?: number }>
}

export interface ClearanceBreakdownItem {
  label: string
  amount?: number
  status: ClearanceItemStatus
  pendingPayment?: PendingPaymentDetail
}

export interface ClearanceRequirement {
  name: string
  status: ClearanceItemStatus
  items?: ClearanceBreakdownItem[]
}

export interface Clearance {
  id: string
  studentId: string
  studentName: string
  semester?: string
  academicYear?: string
  requirements: ClearanceRequirement[]
  overallStatus: ClearanceItemStatus
}
