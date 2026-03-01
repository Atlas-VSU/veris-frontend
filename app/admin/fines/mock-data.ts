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
  // ─ Angela Reyes: 1 fine (₱50) — GCash payment submitted, pending review
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
  // ─ Daniel Villanueva: 2 fines (₱50 + ₱50 = ₱100 total) — fi4 has a pending appeal;
  //   student has NOT submitted payment since one fine is still under appeal review.
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
    // No payment submitted — one fine is still under appeal, student is awaiting resolution
  },
  // ─ Juan Dela Cruz: 2 fines (₱25 + ₱50 = ₱75 total) — Bank Transfer payment pending review
  //   Showcases: multiple fine types, Bank Transfer as payment method, pending status
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
      {
        id: "fi6b",
        itemNumber: 2,
        fineTypeCode: "ABSENT",
        fineTypeName: "Absence Fine",
        eventName: "Budget Planning Meeting",
        eventDate: "2024-10-14",
        amount: 50,
        reason: "Absent - Budget Planning Meeting",
        issuedBy: "Admin",
        issuedAt: "2024-10-15",
        isWaived: false,
      },
    ],
    bulkPaymentSubmission: {
      id: "bps5",
      receiptImage: "/receipts/bulk-juan-delacruz.png",
      amountPaid: 75,
      paymentMethod: "Bank Transfer",
      dateOfPayment: "2024-11-24",
      status: "pending",
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
  // ─ Patricia Navarro: 3 fines of different types (₱50 + ₱25 + ₱100 = ₱175 total) —
  //   Bank Transfer payment approved (settled)
  //   Showcases: diverse fine types inc. MAJOR_EVENT, large total, Bank Transfer approved
  {
    studentId: "2024-00105",
    studentName: "Patricia Navarro",
    fineItems: [
      {
        id: "fi8a",
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
      {
        id: "fi8b",
        itemNumber: 2,
        fineTypeCode: "VIOLATION",
        fineTypeName: "Late Submission Violation",
        amount: 25,
        reason: "Late submission of event evaluation form",
        issuedBy: "Admin",
        issuedAt: "2024-11-03",
        isWaived: false,
      },
      {
        id: "fi8c",
        itemNumber: 3,
        fineTypeCode: "MAJOR_EVENT",
        fineTypeName: "Major Event Violation",
        eventName: "Recognition Night",
        eventDate: "2024-10-30",
        amount: 100,
        reason: "Left the venue before the official program ended",
        timeViolation: "Departed approx. 1 hr before official dismissal",
        issuedBy: "Admin",
        issuedAt: "2024-10-31",
        isWaived: false,
      },
    ],
    bulkPaymentSubmission: {
      id: "bps6",
      receiptImage: "/receipts/bulk-patricia-navarro.png",
      amountPaid: 175,
      paymentMethod: "Bank Transfer",
      dateOfPayment: "2024-11-27",
      status: "approved",
    },
  },
  // ─ Lorenzo Perez: 1 fine (₱75, with time violation) — Cash payment pending (over-the-counter)
  //   Showcases: cash payment method, time violation detail, pending review
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
      paymentMethod: "Cash",
      dateOfPayment: "2024-11-30",
      status: "pending",
    },
  },
  // ─ Camille Fernandez: 2 fines — BOTH appeals were approved and fines were waived
  //   Result: "paid"/settled status with no payment required — all cleared via appeals
  //   Showcases: all-waived-via-approved-appeals, happy-path appeal resolution
  {
    studentId: "2024-00111",
    studentName: "Camille Fernandez",
    fineItems: [
      {
        id: "fi10a",
        itemNumber: 1,
        fineTypeCode: "ABSENT",
        fineTypeName: "Absence Fine",
        eventName: "Tech Workshop: Web Dev",
        eventDate: "2024-10-20",
        amount: 50,
        reason: "Absent - Tech Workshop: Web Dev",
        issuedBy: "Admin",
        issuedAt: "2024-10-21",
        isWaived: true,
        waivedBy: "Admin",
        waivedAt: "2024-11-02",
        waivedReason: "Appeal approved — student was on official duty as a student regent representative.",
        appeal: {
          notes: "I was attending a university-wide student council meeting as a student regent representative. I have the official minutes as proof.",
          appealedAt: "2024-10-25",
          status: "approved",
          resolvedBy: "Admin",
          resolvedAt: "2024-11-02",
        },
      },
      {
        id: "fi10b",
        itemNumber: 2,
        fineTypeCode: "VIOLATION",
        fineTypeName: "Late Document Violation",
        amount: 25,
        reason: "Late submission of clearance docs",
        issuedBy: "Admin",
        issuedAt: "2024-10-15",
        isWaived: true,
        waivedBy: "Admin",
        waivedAt: "2024-11-02",
        waivedReason: "Appeal approved — office system was down during the submission window; delay was not student's fault.",
        appeal: {
          notes: "The USSC online portal was inaccessible on the submission deadline day. I have a screenshot with timestamp showing the 502 error.",
          appealedAt: "2024-10-18",
          status: "approved",
          resolvedBy: "Admin",
          resolvedAt: "2024-11-02",
        },
      },
    ],
    // No payment — all fines cleared via approved appeals
  },
  // ─ Maria Santos: 2 fines — both with pending appeals, no payment yet
  {
    studentId: "2024-00101",
    studentName: "Maria Santos",
    fineItems: [
      {
        id: "fi11",
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
          notes: "I had a university-level competition that day and submitted an excuse letter to the dean's office.",
          appealedAt: "2024-09-20",
          status: "pending",
        },
      },
      {
        id: "fi12",
        itemNumber: 2,
        fineTypeCode: "ABSENT",
        fineTypeName: "Absence Fine",
        eventName: "Tech Workshop: Web Dev",
        eventDate: "2024-10-20",
        amount: 50,
        reason: "Absent - Tech Workshop: Web Dev",
        issuedBy: "Admin",
        issuedAt: "2024-10-21",
        isWaived: false,
        appeal: {
          notes: "I have a medical certificate for the dates covering this event. Fever with doctor's note.",
          appealedAt: "2024-10-25",
          status: "pending",
        },
      },
    ],
  },
  // ─ Rafael Mendoza: 3 fines — 1 pending appeal, 1 approved appeal (waived), 1 no appeal
  {
    studentId: "2024-00108",
    studentName: "Rafael Mendoza",
    fineItems: [
      {
        id: "fi13",
        itemNumber: 1,
        fineTypeCode: "ABSENT",
        fineTypeName: "Absence Fine",
        eventName: "USSC Welcome Party",
        eventDate: "2024-08-30",
        amount: 50,
        reason: "Absent - USSC Welcome Party",
        issuedBy: "Admin",
        issuedAt: "2024-09-01",
        isWaived: false,
        appeal: {
          notes: "Family emergency required me to travel home. I have a travel receipt as proof.",
          appealedAt: "2024-09-05",
          status: "pending",
        },
      },
      {
        id: "fi14",
        itemNumber: 2,
        fineTypeCode: "VIOLATION",
        fineTypeName: "Late Submission Violation",
        amount: 25,
        reason: "Late submission of project proposal",
        issuedBy: "Admin",
        issuedAt: "2024-09-25",
        isWaived: true,
        waivedBy: "Admin",
        waivedAt: "2024-10-05",
        waivedReason: "Appeal approved — faculty adviser confirmed extended deadline was granted.",
        appeal: {
          notes: "Our section was granted an extension by our faculty adviser due to lab conflicts.",
          appealedAt: "2024-09-28",
          status: "approved",
          resolvedBy: "Admin",
          resolvedAt: "2024-10-05",
        },
      },
      {
        id: "fi15",
        itemNumber: 3,
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
  },
  // ─ Bianca Rivera: 1 fine with a REJECTED appeal — fine stands; student submitted Cash payment
  //   Showcases: rejected appeal + Cash payment method + pending review after rejection
  {
    studentId: "2024-00113",
    studentName: "Bianca Rivera",
    fineItems: [
      {
        id: "fi16",
        itemNumber: 1,
        fineTypeCode: "MAJOR_EVENT",
        fineTypeName: "Major Event Violation",
        eventName: "General Assembly 2024",
        eventDate: "2024-09-15",
        amount: 100,
        reason: "Left the event before the official dismissal time",
        timeViolation: "Departed approx. 2 hrs before end of event",
        issuedBy: "Admin",
        issuedAt: "2024-09-16",
        isWaived: false,
        appeal: {
          notes: "I had to pick up my sibling from the hospital. I informed the event committee before leaving.",
          appealedAt: "2024-09-18",
          status: "rejected",
          resolvedBy: "Admin",
          resolvedAt: "2024-09-30",
          rejectionReason: "Insufficient documentation. The committee was not formally notified prior to the event.",
        },
      },
    ],
    // Appeal was rejected — fine stands; student paid over-the-counter
    bulkPaymentSubmission: {
      id: "bps-bianca",
      receiptImage: "/receipts/bulk-bianca-rivera.png",
      amountPaid: 100,
      paymentMethod: "Cash",
      dateOfPayment: "2024-10-15",
      status: "pending",
    },
  },
  // ─ Jasmine Gonzales: 2 fines — fi17 has a pending appeal; NO payment submitted
  //   Student is waiting for the appeal result before paying the remaining fine
  {
    studentId: "2024-00117",
    studentName: "Jasmine Gonzales",
    fineItems: [
      {
        id: "fi17",
        itemNumber: 1,
        fineTypeCode: "ABSENT",
        fineTypeName: "Absence Fine",
        eventName: "Community Outreach Program",
        eventDate: "2024-11-05",
        amount: 50,
        reason: "Absent - Community Outreach Program",
        issuedBy: "Admin",
        issuedAt: "2024-11-06",
        isWaived: false,
        appeal: {
          notes: "I was on official school duty as a varsity athlete during that weekend. I have a travel order from the PE department.",
          appealedAt: "2024-11-10",
          status: "pending",
        },
      },
      {
        id: "fi18",
        itemNumber: 2,
        fineTypeCode: "VIOLATION",
        fineTypeName: "Late Submission Violation",
        amount: 25,
        reason: "Late submission of event evaluation form",
        issuedBy: "Admin",
        issuedAt: "2024-10-28",
        isWaived: false,
      },
    ],
    // No payment — fi17 is still under appeal; awaiting resolution before settling all fines
  },
  // ─ Andrei Lopez: 1 fine — pending appeal, no payment yet
  {
    studentId: "2024-00112",
    studentName: "Andrei Lopez",
    fineItems: [
      {
        id: "fi19",
        itemNumber: 1,
        fineTypeCode: "ABSENT",
        fineTypeName: "Absence Fine",
        eventName: "Budget Planning Meeting",
        eventDate: "2025-02-10",
        amount: 50,
        reason: "Absent - Budget Planning Meeting",
        issuedBy: "Admin",
        issuedAt: "2025-02-11",
        isWaived: false,
        appeal: {
          notes: "I was enrolled in a conflicting class at the same time slot. I have my class schedule as supporting document.",
          appealedAt: "2025-02-14",
          status: "pending",
        },
      },
    ],
  },
  // ─ Nicole Tan: 2 fines — 1 pending appeal, 1 pending appeal (different events), no payment yet
  {
    studentId: "2024-00119",
    studentName: "Nicole Tan",
    fineItems: [
      {
        id: "fi20",
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
          notes: "I was hospitalised on September 14–17. Hospital discharge summary is attached.",
          appealedAt: "2024-09-22",
          status: "pending",
        },
      },
      {
        id: "fi21",
        itemNumber: 2,
        fineTypeCode: "MAJOR_EVENT",
        fineTypeName: "Major Event Violation",
        eventName: "USSC Welcome Party",
        eventDate: "2024-08-30",
        amount: 100,
        reason: "Did not fulfil assigned committee role during the event",
        issuedBy: "Admin",
        issuedAt: "2024-09-02",
        isWaived: false,
        appeal: {
          notes: "I was reassigned to a different task by the committee head on the day of the event. I have a text message as proof.",
          appealedAt: "2024-09-08",
          status: "pending",
        },
      },
    ],
  },

  // ─ Marco Reyes: 5 fines across multiple fine types (₱325 total) — no payment action taken
  //   Showcases: high balance, many fines, delinquent student, no payment submission at all
  {
    studentId: "2024-00120",
    studentName: "Marco Reyes",
    fineItems: [
      {
        id: "fi22",
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
      {
        id: "fi23",
        itemNumber: 2,
        fineTypeCode: "MAJOR_EVENT",
        fineTypeName: "Major Event Violation",
        eventName: "Recognition Night",
        eventDate: "2024-10-30",
        amount: 100,
        reason: "Did not attend the organisation\'s major event",
        issuedBy: "Admin",
        issuedAt: "2024-10-31",
        isWaived: false,
      },
      {
        id: "fi24",
        itemNumber: 3,
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
      {
        id: "fi25",
        itemNumber: 4,
        fineTypeCode: "VIOLATION",
        fineTypeName: "Late Payment Violation",
        amount: 25,
        reason: "Late payment of membership fee",
        issuedBy: "Admin",
        issuedAt: "2024-08-10",
        isWaived: false,
      },
      {
        id: "fi26",
        itemNumber: 5,
        fineTypeCode: "ABSENT",
        fineTypeName: "Absence Fine",
        eventName: "Community Outreach Program",
        eventDate: "2024-11-05",
        amount: 100,
        reason: "Absent - Community Outreach Program",
        timeViolation: "Signed in but did not complete the required volunteer hours",
        issuedBy: "Admin",
        issuedAt: "2024-11-06",
        isWaived: false,
      },
    ],
    // No payment submitted — student has not taken any action
  },

  // ─ Sofia Bautista: 2 fines (₱50 + ₱25 = ₱75 total) — GCash payment declined
  //   Reason: reference number could not be verified in transaction records
  //   Showcases: declined payment with a different rejection reason (invalid ref no.)
  {
    studentId: "2024-00121",
    studentName: "Sofia Bautista",
    fineItems: [
      {
        id: "fi27",
        itemNumber: 1,
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
      {
        id: "fi28",
        itemNumber: 2,
        fineTypeCode: "VIOLATION",
        fineTypeName: "Late Submission Violation",
        amount: 25,
        reason: "Late submission of organisation membership form",
        issuedBy: "Admin",
        issuedAt: "2024-08-20",
        isWaived: false,
      },
    ],
    bulkPaymentSubmission: {
      id: "bps-sofia",
      receiptImage: "/receipts/bulk-sofia-bautista.png",
      amountPaid: 75,
      paymentMethod: "GCash",
      gcashReferenceNumber: "GC-2024-11-XXXXX",
      dateOfPayment: "2024-11-20",
      status: "declined",
      rejectionReason:
        "The GCash reference number provided could not be verified in our transaction records. Please double-check the reference number and resubmit.",
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
