import type { Payment, StudentUnpaidRecord } from "./types"

// Students pay all outstanding fines AND fees together in a single bulk GCash
// transaction at the end of the semester. Each entry below represents one such
// end-of-semester bulk submission. lineItems details exactly what is covered.
export const payments: Payment[] = [
  // ─ Angela Reyes: 1 fine (₱50) — pending review
  {
    id: "pay1",
    studentId: "2024-00103",
    studentName: "Angela Reyes",
    type: "bulk",
    amount: 50,
    referenceCode: "GC-2024-11-280001",
    receiptImage: "/receipts/bulk-angela-reyes.png",
    status: "pending",
    submittedDate: "2024-11-28",
    lineItems: [
      { type: "fine", referenceId: "fi1", name: "Absence Fine — State of the Student Address 2nd Semester A.Y. 2025-2026", amount: 50 },
    ],
  },
  // ─ Isabelle Cruz: 1 fine (₱50) — declined (receipt unclear)
  {
    id: "pay3",
    studentId: "2024-00109",
    studentName: "Isabelle Cruz",
    type: "bulk",
    amount: 100,
    referenceCode: "GC-2024-11-260001",
    receiptImage: "/receipts/bulk-isabelle-cruz.png",
    status: "declined",
    submittedDate: "2024-11-26",
    reviewedDate: "2024-11-27",
    reviewedBy: "Admin",
    remarks: "Receipt image is unclear. Please resubmit with a clearer photo.",
    lineItems: [
      { type: "fee", name: "2nd Semester USSC Membership Fee", amount: 100, referenceId: "fee-1" },
    ],
  },

  {
    id: "pay4",
    studentId: "2024-00110",
    studentName: "Daniel Villanueva",
    type: "bulk",
    amount: 150,
    referenceCode: "GC-2024-11-290001",
    receiptImage: "/receipts/bulk-daniel-villanueva.png",
    status: "pending",
    submittedDate: "2024-11-29",
    lineItems: [
      { type: "fine", referenceId: "fi4", name: "Absence Fine — State of the Student Address 2nd Semester A.Y. 2025-2026", amount: 50 },
      { type: "fee",  referenceId: "fee-1", name: "2nd Semester USSC Membership Fee", amount: 100 },
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
      { type: "fine", referenceId: "fi8", name: "Absence Fine — State of the Student Address 2nd Semester A.Y. 2025-2026", amount: 50 },
    ],
  },
  // ─ Lorenzo Perez: 1 fine (₱50) — pending review
  {
    id: "pay6",
    studentId: "2024-00118",
    studentName: "Lorenzo Perez",
    type: "bulk",
    amount: 50,
    referenceCode: "GC-2024-11-300001",
    receiptImage: "/receipts/bulk-lorenzo-perez.png",
    status: "pending",
    submittedDate: "2024-11-30",
    lineItems: [
      { type: "fine", referenceId: "fi9", name: "Absence Fine — State of the Student Address 2nd Semester A.Y. 2025-2026", amount: 50 },
    ],
  },
  // ─ Juan Dela Cruz: 1 fine (₱50) — approved
  {
    id: "pay7",
    studentId: "2024-00102",
    studentName: "Juan Dela Cruz",
    type: "bulk",
    amount: 50,
    referenceCode: "GC-2024-11-240001",
    receiptImage: "/receipts/bulk-juan-delacruz.png",
    status: "approved",
    submittedDate: "2024-11-24",
    reviewedDate: "2024-11-25",
    reviewedBy: "Admin",
    lineItems: [
      { type: "fine", referenceId: "fi6", name: "Absence Fine — State of the Student Address 2nd Semester A.Y. 2025-2026", amount: 50 },
    ],
  },
  // ─ Camille Fernandez: 1 fine (₱50) — approved
  {
    id: "pay8",
    studentId: "2024-00111",
    studentName: "Camille Fernandez",
    type: "bulk",
    amount: 50,
    referenceCode: "GC-2024-11-230001",
    receiptImage: "/receipts/bulk-camille-fernandez.png",
    status: "approved",
    submittedDate: "2024-11-23",
    reviewedDate: "2024-11-24",
    reviewedBy: "Admin",
    lineItems: [
      { type: "fine", referenceId: "fi10", name: "Absence Fine — State of the Student Address 2nd Semester A.Y. 2025-2026", amount: 50 },
    ],
  },
]

export const unpaidStudentRecords: StudentUnpaidRecord[] = [
  {
    studentId: "2024-00101",
    studentName: "Maria Santos",
    program: "BS Computer Science",
    yearLevel: 3,
    dues: [
      { id: "due-1", type: "fee", name: "2nd Semester USSC Membership Fee", amount: 100, referenceId: "fee-1" },
      { id: "due-2", type: "fine", name: "Absence Fine — State of the Student Address 2nd Semester A.Y. 2025-2026", amount: 50, referenceId: "fi-m1" },
    ],
  },
  {
    studentId: "2024-00104",
    studentName: "Carlos Garcia",
    program: "BS Information Systems",
    yearLevel: 1,
    dues: [
      { id: "due-3", type: "fee", name: "2nd Semester USSC Membership Fee", amount: 100, referenceId: "fee-1" },
    ],
  },
  {
    studentId: "2024-00107",
    studentName: "Sofia Bautista",
    program: "BS Information Systems",
    yearLevel: 1,
    dues: [
      { id: "due-4", type: "fee", name: "2nd Semester USSC Membership Fee", amount: 100, referenceId: "fee-1" },
      { id: "due-5", type: "fine", name: "Absence Fine — State of the Student Address 2nd Semester A.Y. 2025-2026", amount: 50, referenceId: "fi-s1" },
    ],
  },
  {
    studentId: "2024-00108",
    studentName: "Rafael Mendoza",
    program: "BS Computer Science",
    yearLevel: 4,
    dues: [
      { id: "due-6", type: "fine", name: "Absence Fine — State of the Student Address 2nd Semester A.Y. 2025-2026", amount: 50, referenceId: "fi-r1" },
    ],
  },
  {
    studentId: "2024-00106",
    studentName: "Miguel Torres",
    program: "BS Information Technology",
    yearLevel: 3,
    dues: [
      { id: "due-7", type: "fee", name: "2nd Semester USSC Membership Fee", amount: 100, referenceId: "fee-1" },
      { id: "due-8", type: "fine", name: "Absence Fine — State of the Student Address 2nd Semester A.Y. 2025-2026", amount: 50, referenceId: "fi-mt1" },
    ],
  },
]
