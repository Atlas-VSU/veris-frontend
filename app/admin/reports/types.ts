export interface FinancialSummary {
  totalCollected: number
  totalFines: number
  totalPending: number
  totalStudents: number
  monthlyCollections: { month: string; amount: number }[]
  feeStatusBreakdown: { status: string; count: number }[]
  fineStatusBreakdown: { status: string; count: number }[]
}
