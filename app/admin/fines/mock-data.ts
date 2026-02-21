import type { StudentFineRecord } from "./types"

// ─── Legacy flat-fine type used by dashboard / reports / portal ────────────
export type FlatFineStatus = "unpaid" | "paid" | "waived"
export interface FlatFine {
  id: string
  studentId: string
  studentName: string
  reason: string
  amount: number
  status: FlatFineStatus
  dateIssued: string
  datePaid?: string
}

export const studentFineRecords: StudentFineRecord[] = [
  // ─ Angela Reyes: 1 fine (₱50) — bulk payment submitted end-of-sem, pending review
  {
    studentId: "2024-00103",
    studentName: "Angela Reyes",
    fineItems: [
      {
        id: "fi1",
        itemNumber: 1,
        fineTypeCode: "ABSENT",
        fineTypeName: "Absence Fine",
        eventName: "General Assembly 2024",
        eventDate: "2024-09-15",
        amount: 50,
        reason: "Absent - General Assembly 2024",
        issuedBy: "Admin",
        issuedAt: "2024-09-16",
        isWaived: false,
      },
    ],
    bulkPaymentSubmission: {
      id: "bps1",
      receiptImage: "/receipts/bulk-angela-reyes.png",
      amountPaid: 50,
      paymentMethod: "GCash",
      gcashReferenceNumber: "GC-2024-11-280001",
      dateOfPayment: "2024-11-28",
      status: "pending",
    },
  },
  // ─ Miguel Torres: 1 fine (₱25) — bulk payment approved (settled)
  {
    studentId: "2024-00106",
    studentName: "Miguel Torres",
    fineItems: [
      {
        id: "fi2",
        itemNumber: 1,
        fineTypeCode: "VIOLATION",
        fineTypeName: "Late Submission Violation",
        amount: 25,
        reason: "Late submission of requirements",
        issuedBy: "Admin",
        issuedAt: "2024-09-20",
        isWaived: false,
      },
    ],
    bulkPaymentSubmission: {
      id: "bps2",
      receiptImage: "/receipts/bulk-miguel-torres.png",
      amountPaid: 25,
      paymentMethod: "GCash",
      gcashReferenceNumber: "GC-2024-11-250001",
      dateOfPayment: "2024-11-25",
      status: "approved",
    },
  },
  // ─ Isabelle Cruz: 1 fine (₱50) — bulk payment declined (receipt unclear), resubmission needed
  {
    studentId: "2024-00109",
    studentName: "Isabelle Cruz",
    fineItems: [
      {
        id: "fi3",
        itemNumber: 1,
        fineTypeCode: "ABSENT",
        fineTypeName: "Absence Fine",
        eventName: "Leadership Seminar",
        eventDate: "2024-10-05",
        amount: 50,
        reason: "Absent - Leadership Seminar",
        issuedBy: "Admin",
        issuedAt: "2024-10-06",
        isWaived: false,
      },
    ],
    bulkPaymentSubmission: {
      id: "bps3",
      receiptImage: "/receipts/bulk-isabelle-cruz.png",
      amountPaid: 50,
      paymentMethod: "GCash",
      gcashReferenceNumber: "GC-2024-11-260001",
      dateOfPayment: "2024-11-26",
      status: "declined",
      rejectionReason: "Receipt image is unclear. Please resubmit with a clearer photo.",
    },
  },
  // ─ Daniel Villanueva: 2 fines (₱50 + ₱50 = ₱100 total) — bulk payment of ₱100 pending
  //   fi4 has a pending appeal; student still submitted payment for both fines
  {
    studentId: "2024-00110",
    studentName: "Daniel Villanueva",
    fineItems: [
      {
        id: "fi4",
        itemNumber: 1,
        fineTypeCode: "ABSENT",
        fineTypeName: "Absence Fine",
        eventName: "General Assembly 2024",
        eventDate: "2024-09-15",
        amount: 50,
        reason: "Absent - General Assembly 2024",
        issuedBy: "Admin",
        issuedAt: "2024-09-16",
        isWaived: false,
        appeal: {
          notes: "I was sick on this day and have a medical certificate as proof.",
          appealedAt: "2024-10-01",
          status: "pending",
        },
      },
      {
        id: "fi5",
        itemNumber: 2,
        fineTypeCode: "ABSENT",
        fineTypeName: "Absence Fine",
        eventName: "USSC Welcome Party",
        eventDate: "2024-08-30",
        amount: 50,
        reason: "Absent - USSC Welcome Party",
        issuedBy: "Admin",
        issuedAt: "2024-09-01",
        isWaived: false,
      },
    ],
    bulkPaymentSubmission: {
      id: "bps4",
      receiptImage: "/receipts/bulk-daniel-villanueva.png",
      amountPaid: 100,
      paymentMethod: "GCash",
      gcashReferenceNumber: "GC-2024-11-290001",
      dateOfPayment: "2024-11-29",
      status: "pending",
    },
  },
  // ─ Juan Dela Cruz: 1 fine (₱25) — bulk payment approved (settled)
  {
    studentId: "2024-00102",
    studentName: "Juan Dela Cruz",
    fineItems: [
      {
        id: "fi6",
        itemNumber: 1,
        fineTypeCode: "VIOLATION",
        fineTypeName: "Late Payment Violation",
        amount: 25,
        reason: "Late payment of membership fee",
        issuedBy: "Admin",
        issuedAt: "2024-08-01",
        isWaived: false,
      },
    ],
    bulkPaymentSubmission: {
      id: "bps5",
      receiptImage: "/receipts/bulk-juan-delacruz.png",
      amountPaid: 25,
      paymentMethod: "GCash",
      gcashReferenceNumber: "GC-2024-11-240001",
      dateOfPayment: "2024-11-24",
      status: "approved",
    },
  },
  // ─ Enrique Castillo: 1 fine (₱100) — waived entirely, no payment needed
  {
    studentId: "2024-00114",
    studentName: "Enrique Castillo",
    fineItems: [
      {
        id: "fi7",
        itemNumber: 1,
        fineTypeCode: "MAJOR_EVENT",
        fineTypeName: "Major Event Violation",
        amount: 100,
        reason: "Violation of event guidelines",
        issuedBy: "Admin",
        issuedAt: "2024-10-21",
        isWaived: true,
        waivedBy: "Admin",
        waivedAt: "2024-11-01",
        waivedReason: "First offense; student acknowledged the violation.",
      },
    ],
  },
  // ─ Patricia Navarro: 1 fine (₱50) — bulk payment approved (settled)
  {
    studentId: "2024-00105",
    studentName: "Patricia Navarro",
    fineItems: [
      {
        id: "fi8",
        itemNumber: 1,
        fineTypeCode: "ABSENT",
        fineTypeName: "Absence Fine",
        eventName: "Budget Planning Meeting",
        eventDate: "2024-11-10",
        amount: 50,
        reason: "Absent - Budget Planning Meeting",
        issuedBy: "Admin",
        issuedAt: "2024-11-11",
        isWaived: false,
      },
    ],
    bulkPaymentSubmission: {
      id: "bps6",
      receiptImage: "/receipts/bulk-patricia-navarro.png",
      amountPaid: 50,
      paymentMethod: "GCash",
      gcashReferenceNumber: "GC-2024-11-270001",
      dateOfPayment: "2024-11-27",
      status: "approved",
    },
  },
  // ─ Lorenzo Perez: 1 fine (₱75, with time violation) — bulk payment submitted, pending
  {
    studentId: "2024-00118",
    studentName: "Lorenzo Perez",
    fineItems: [
      {
        id: "fi9",
        itemNumber: 1,
        fineTypeCode: "ABSENT",
        fineTypeName: "Absence Fine",
        eventName: "Community Outreach",
        eventDate: "2024-11-25",
        amount: 75,
        reason: "Absent - Community Outreach",
        timeViolation: "Arrived 2 hours past the event start time",
        issuedBy: "Admin",
        issuedAt: "2024-11-26",
        isWaived: false,
      },
    ],
    bulkPaymentSubmission: {
      id: "bps7",
      receiptImage: "/receipts/bulk-lorenzo-perez.png",
      amountPaid: 75,
      paymentMethod: "GCash",
      gcashReferenceNumber: "GC-2024-11-300001",
      dateOfPayment: "2024-11-30",
      status: "pending",
    },
  },
  // ─ Camille Fernandez: 1 fine (₱25) — bulk payment approved (settled)
  {
    studentId: "2024-00111",
    studentName: "Camille Fernandez",
    fineItems: [
      {
        id: "fi10",
        itemNumber: 1,
        fineTypeCode: "VIOLATION",
        fineTypeName: "Late Document Violation",
        amount: 25,
        reason: "Late submission of clearance docs",
        issuedBy: "Admin",
        issuedAt: "2024-10-15",
        isWaived: false,
      },
    ],
    bulkPaymentSubmission: {
      id: "bps8",
      receiptImage: "/receipts/bulk-camille-fernandez.png",
      amountPaid: 25,
      paymentMethod: "GCash",
      gcashReferenceNumber: "GC-2024-11-230001",
      dateOfPayment: "2024-11-23",
      status: "approved",
    },
  },
]

// ─── Derived flat list for backward compat (dashboard, reports, portal) ────
// Status is derived from the record-level bulkPaymentSubmission, reflecting the
// real-world pattern where students settle all fines in a single end-of-semester payment.
export const fines: FlatFine[] = studentFineRecords.flatMap(r =>
  r.fineItems.map(i => ({
    id: i.id,
    studentId: r.studentId,
    studentName: r.studentName,
    reason: i.reason,
    amount: i.amount,
    status: (i.isWaived
      ? "waived"
      : r.bulkPaymentSubmission?.status === "approved"
        ? "paid"
        : "unpaid") as FlatFineStatus,
    dateIssued: i.issuedAt,
    datePaid: r.bulkPaymentSubmission?.status === "approved"
      ? r.bulkPaymentSubmission.dateOfPayment
      : undefined,
  }))
)
