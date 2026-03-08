import type { FinancialSummary } from "./types"

// export { membershipFees } from "../membership-fees/mock-data"
export { fines } from "../fines/mock-data"

export const financialSummary: FinancialSummary = {
  totalCollected: 1800,
  totalFines: 250,
  totalPending: 900,
  totalStudents: 20,
  monthlyCollections: [
    { month: "Jul", amount: 1050 },
    { month: "Aug", amount: 300 },
    { month: "Sep", amount: 200 },
    { month: "Oct", amount: 150 },
    { month: "Nov", amount: 100 },
  ],
  feeStatusBreakdown: [
    { status: "Paid", count: 12 },
    { status: "Unpaid", count: 6 },
    { status: "Partial", count: 2 },
  ],
  fineStatusBreakdown: [
    { status: "Unpaid", count: 4 },
    { status: "Paid", count: 1 },
    { status: "Waived", count: 1 },
  ],
}
