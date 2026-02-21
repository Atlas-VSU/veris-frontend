import type { Payment } from "./types"

// Students pay all outstanding fines AND fees together in a single bulk GCash
// transaction at the end of the semester. Each entry below represents one such
// end-of-semester bulk submission. lineItems details exactly what is covered.
export const payments: Payment[] = [
  // ─ Angela Reyes: 1 fine (₱50) + Community Outreach fee (₱50) = ₱100 bulk
  {
    id: "pay1",
    studentId: "2024-00103",
    studentName: "Angela Reyes",
    type: "bulk",
    amount: 100,
    referenceCode: "GC-2024-11-280001",
    receiptImage: "/receipts/bulk-angela-reyes.png",
    status: "pending",
    submittedDate: "2024-11-28",
    lineItems: [
      { type: "fine", referenceId: "fi1",    name: "Absence Fine — General Assembly 2024",  amount: 50 },
      { type: "fee",  referenceId: "fee-2",  name: "Community Outreach Charity Fee",          amount: 50 },
    ],
  },
  // ─ Miguel Torres: 1 fine (₱25) — approved
  {
    id: "pay2",
    studentId: "2024-00106",
    studentName: "Miguel Torres",
    type: "bulk",
    amount: 25,
    referenceCode: "GC-2024-11-250001",
    receiptImage: "/receipts/bulk-miguel-torres.png",
    status: "approved",
    submittedDate: "2024-11-25",
    reviewedDate: "2024-11-26",
    reviewedBy: "Admin",
    lineItems: [
      { type: "fine", referenceId: "fi2", name: "Late Submission Violation", amount: 25 },
    ],
  },
  // ─ Isabelle Cruz: 1 fine (₱50) — declined (receipt unclear)
  {
    id: "pay3",
    studentId: "2024-00109",
    studentName: "Isabelle Cruz",
    type: "bulk",
    amount: 50,
    referenceCode: "GC-2024-11-260001",
    receiptImage: "/receipts/bulk-isabelle-cruz.png",
    status: "declined",
    submittedDate: "2024-11-26",
    reviewedDate: "2024-11-27",
    reviewedBy: "Admin",
    remarks: "Receipt image is unclear. Please resubmit with a clearer photo.",
    lineItems: [
      { type: "fine", referenceId: "fi3", name: "Absence Fine — Leadership Seminar", amount: 50 },
    ],
  },
  // ─ Daniel Villanueva: 2 fines (₱100) + rejected membership fee retry (₱150) = ₱250 bulk, pending
  {
    id: "pay4",
    studentId: "2024-00110",
    studentName: "Daniel Villanueva",
    type: "bulk",
    amount: 250,
    referenceCode: "GC-2024-11-290001",
    receiptImage: "/receipts/bulk-daniel-villanueva.png",
    status: "pending",
    submittedDate: "2024-11-29",
    lineItems: [
      { type: "fine", referenceId: "fi4",   name: "Absence Fine — General Assembly 2024", amount: 50 },
      { type: "fine", referenceId: "fi5",   name: "Absence Fine — USSC Welcome Party",    amount: 50 },
      { type: "fee",  referenceId: "fee-1", name: "1st Semester Membership Fee (retry)",   amount: 150 },
    ],
  },
  // ─ Patricia Navarro: 1 fine (₱50) — approved
  {
    id: "pay5",
    studentId: "2024-00105",
    studentName: "Patricia Navarro",
    type: "bulk",
    amount: 50,
    referenceCode: "GC-2024-11-270001",
    receiptImage: "/receipts/bulk-patricia-navarro.png",
    status: "approved",
    submittedDate: "2024-11-27",
    reviewedDate: "2024-11-28",
    reviewedBy: "Admin",
    lineItems: [
      { type: "fine", referenceId: "fi8", name: "Absence Fine — Budget Planning Meeting", amount: 50 },
    ],
  },
  // ─ Lorenzo Perez: 1 fine (₱75) — pending review
  {
    id: "pay6",
    studentId: "2024-00118",
    studentName: "Lorenzo Perez",
    type: "bulk",
    amount: 75,
    referenceCode: "GC-2024-11-300001",
    receiptImage: "/receipts/bulk-lorenzo-perez.png",
    status: "pending",
    submittedDate: "2024-11-30",
    lineItems: [
      { type: "fine", referenceId: "fi9", name: "Absence Fine — Community Outreach", amount: 75 },
    ],
  },
  // ─ Juan Dela Cruz: 1 fine (₱25) — approved
  {
    id: "pay7",
    studentId: "2024-00102",
    studentName: "Juan Dela Cruz",
    type: "bulk",
    amount: 25,
    referenceCode: "GC-2024-11-240001",
    receiptImage: "/receipts/bulk-juan-delacruz.png",
    status: "approved",
    submittedDate: "2024-11-24",
    reviewedDate: "2024-11-25",
    reviewedBy: "Admin",
    lineItems: [
      { type: "fine", referenceId: "fi6", name: "Late Payment Violation", amount: 25 },
    ],
  },
  // ─ Camille Fernandez: 1 fine (₱25) — approved
  {
    id: "pay8",
    studentId: "2024-00111",
    studentName: "Camille Fernandez",
    type: "bulk",
    amount: 25,
    referenceCode: "GC-2024-11-230001",
    receiptImage: "/receipts/bulk-camille-fernandez.png",
    status: "approved",
    submittedDate: "2024-11-23",
    reviewedDate: "2024-11-24",
    reviewedBy: "Admin",
    lineItems: [
      { type: "fine", referenceId: "fi10", name: "Late Document Violation", amount: 25 },
    ],
  },
]
