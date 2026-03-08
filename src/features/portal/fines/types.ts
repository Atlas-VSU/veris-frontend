// Portal-facing fine types (student view)
export type FineStatus = "unpaid" | "paid" | "waived"

export interface Fine {
  id: string
  studentId: string
  studentName: string
  reason: string
  amount: number
  status: FineStatus
  dateIssued: string
  datePaid?: string
  eventId?: string
}
