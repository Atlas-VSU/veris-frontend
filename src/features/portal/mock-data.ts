import { events } from "../admin/events/mock-data"
import type { StudentFineRecord } from "../admin/fines/types"
import type { Clearance } from "../admin/clearance/types"
import type { Fee, PaymentLog } from "../admin/fees/types"
import type { EventAttendance } from "../admin/events/types"
import type { Student } from "../admin/members/types"

// demo student with every possible UI scenario covered 
// this mock student has data crafted to exercise every state/variant
// in the portal ui: all fee statuses, all fine states, all clearance states,
// all event attendance statuses.

export const currentStudent: Student = {
  id: "demo",
  studentId: "04-1-00199",
  firstName: "Alex",
  lastName: "Demo",
  email: "04-1-00199@vsu.edu.ph",
  program: "BS Computer Science",
  yearLevel: 3,
  status: "approved",
  registrationDate: "2024-06-15",
}

export const currentStudentFees: Fee[] = [
  {
    id: "fee-2",
    title: "USSC Membership Fee",
    description: "Annual USSC membership fee for 2nd semester A.Y. 2025-2026.",
    type: "semestral-membership",
    amount: 100,
    academicYear: "2025-2026",
    semester: "2nd Semester",
    createdAt: "2026-07-01",
    totalStudents: 20,
    paidCount: 10,
  },
  {
    id: "fee-1",
    title: "Faculty of Computing Research Colloquium",
    description: "Contribution for the faculty's research colloquium.",
    type: "organization-fee",
    amount: 200,
    academicYear: "2025-2026",
    semester: "2nd Semester",
    createdAt: "2024-10-15",
    totalStudents: 20,
    paidCount: 3,
  },
  // {
  //   id: "fee-3",
  //   title: "State of the Student Address Event Fee",
  //   description: "Administrative fee for the State of the Student Address 2nd Semester A.Y. 2025-2026.",
  //   type: "event-fee",
  //   amount: 30,
  //   academicYear: "2025-2026",
  //   semester: "1st Semester",
  //   createdAt: "2024-09-01",
  //   totalStudents: 20,
  //   paidCount: 2,
  // },

]

export const currentStudentPaymentLogs: PaymentLog[] = [
  // fee-1: verified (paid)
  // {
  //   id: "demo-pl1",
  //   feeId: "fee-1",
  //   feeName: "1st Semester Membership Fee",
  //   studentId: currentStudent.studentId,
  //   studentName: `${currentStudent.firstName} ${currentStudent.lastName}`,
  //   status: "pending_verification",
  //   amountPaid: 150,  
  //   paymentMethod: "gcash",
  //   gcashReferenceNumber: "GC-2024-07-199001",
  //   receiptImage: "/receipts/demo1.png",
  //   paidAt: "2024-07-10",
  //   verifiedBy: "Admin",
  //   verifiedAt: "2024-07-11",
  // },
  // // fee-2: pending_verification
  // {
  //   id: "demo-pl2",
  //   feeId: "fee-2",
  //   feeName: "Community Outreach Charity Fee",
  //   studentId: currentStudent.studentId,
  //   studentName: `${currentStudent.firstName} ${currentStudent.lastName}`,
  //   status: "pending_verification",
  //   amountPaid: 50,
  //   paymentMethod: "gcash",
  //   gcashReferenceNumber: "GC-2024-10-199002",
  //   receiptImage: "/receipts/demo2.png",
  //   paidAt: "2024-10-22",
  // },
  // // fee-3: rejected
  // {
  //   id: "demo-pl3",
  //   feeId: "fee-3",
  //   feeName: "State of the Student Address Event Fee",
  //   studentId: currentStudent.studentId,
  //   studentName: `${currentStudent.firstName} ${currentStudent.lastName}`,
  //   status: "rejected",
  //   amountPaid: 30,
  //   paymentMethod: "gcash",
  //   gcashReferenceNumber: "GC-2024-09-199003",
  //   receiptImage: "/receipts/demo3.png",
  //   paidAt: "2024-09-10",
  //   rejectionReason: "Receipt image is blurry. Please resubmit with a clearer photo.",
  // },
  // // fee-4: no payment log → unpaid
]

// ─── Fines: all appeal states + waived + unpaid ───────────────────────────
export const currentStudentFineRecord: StudentFineRecord = {
  studentId: currentStudent.studentId,
  studentName: `${currentStudent.firstName} ${currentStudent.lastName}`,
  fineItems: [
    // 1. Unpaid, no appeal yet → student can submit an appeal
    {
      id: "demo-fi1",
      itemNumber: 1,
      fineTypeCode: "ABSENT",
      fineTypeName: "Absence Fine",
      eventName: "State of the Student Address 2nd Semester A.Y. 2025-2026",
      eventDate: "2024-09-15",
      amount: 50,
      reason: "Missed the major event.",
      issuedBy: "Admin",
      issuedAt: "2026-03-11",
      isWaived: false,
    },
    // 2. Unpaid, appeal is PENDING review
    // {
    //   id: "demo-fi2",
    //   itemNumber: 2,
    //   fineTypeCode: "ABSENT",
    //   fineTypeName: "Absence Fine",
    //   eventName: "Leadership Seminar",
    //   eventDate: "2024-10-05",
    //   amount: 50,
    //   reason: "Absent without notice — Leadership Seminar",
    //   issuedBy: "Admin",
    //   issuedAt: "2024-10-06",
    //   isWaived: false,
    //   appeal: {
    //     notes: "I was concurrently attending a university-required academic competition that day and could not be present. I have attached the official permit signed by my adviser.",
    //     appealedAt: "2024-10-09",
    //     status: "pending",
    //   },
    // },
    // 3. Appeal APPROVED → fine effectively cleared
    // {
    //   id: "demo-fi3",
    //   itemNumber: 3,
    //   fineTypeCode: "ABSENT",
    //   fineTypeName: "Absence Fine",
    //   eventName: "State of the Student Address 1st Semester A.Y. 2025-2026",
    //   eventDate: "2024-10-18",
    //   amount: 50,
    //   reason: "Absent without notice — State of the Student Address 1st Semester A.Y. 2025-2026",
    //   issuedBy: "Admin",
    //   issuedAt: "2024-10-19",
    //   isWaived: false,
    //   appeal: {
    //     notes: "I had a documented medical consultation that overlapped with the event. Attached is my medical certificate from the university clinic.",
    //     appealedAt: "2024-10-22",
    //     status: "approved",
    //     resolvedBy: "Admin",
    //     resolvedAt: "2024-10-28",
    //   },
    // },
    // 4. Appeal REJECTED → student may re-appeal
    // {
    //   id: "demo-fi4",
    //   itemNumber: 4,
    //   fineTypeCode: "MAJOR_EVENT",
    //   fineTypeName: "Major Event Violation",
    //   eventName: "USSC Foundation Day",
    //   eventDate: "2024-10-25",
    //   amount: 100,
    //   reason: "Left the event premises before the official dismissal — USSC Foundation Day",
    //   issuedBy: "Admin",
    //   issuedAt: "2024-10-26",
    //   isWaived: false,
    //   appeal: {
    //     notes: "I had to leave early due to a family emergency. I informed my block representative before leaving.",
    //     appealedAt: "2024-10-29",
    //     status: "rejected",
    //     resolvedBy: "Admin",
    //     resolvedAt: "2024-11-02",
    //     rejectionReason: "No official documentation or prior written request was submitted to the USSC before the event. The appeal cannot be processed without supporting evidence.",
    //   },
    // },
    // 5. Waived by admin (no appeal involved)
    // {
    //   id: "demo-fi5",
    //   itemNumber: 5,
    //   fineTypeCode: "VIOLATION",
    //   fineTypeName: "Uniform Violation",
    //   amount: 30,
    //   reason: "Not wearing prescribed uniform during USSC event",
    //   issuedBy: "Admin",
    //   issuedAt: "2024-09-01",
    //   isWaived: true,
    //   waivedBy: "Admin",
    //   waivedAt: "2024-09-10",
    //   waivedReason: "First-time offense; student was a newly enrolled transferee unaware of the dress code policy.",
    // },
    // 6. Late submission fine, no appeal → can appeal
    // {
    //   id: "demo-fi6",
    //   itemNumber: 6,
    //   fineTypeCode: "VIOLATION",
    //   fineTypeName: "Late Submission Violation",
    //   amount: 25,
    //   reason: "Clearance documents submitted 3 days past the deadline",
    //   issuedBy: "Admin",
    //   issuedAt: "2024-10-20",
    //   isWaived: false,
    // },
    // 7. Unpaid, no appeal → can appeal; event-based fine
    // {
    //   id: "demo-fi7",
    //   itemNumber: 7,
    //   fineTypeCode: "ABSENT",
    //   fineTypeName: "Absence Fine",
    //   eventName: "Community Service Day",
    //   eventDate: "2024-11-09",
    //   amount: 75,
    //   reason: "Absent without notice — Community Service Day",
    //   issuedBy: "Admin",
    //   issuedAt: "2024-11-10",
    //   isWaived: false,
    // },
  ],
  // No bulk payment submission yet — student has outstanding items to pay or appeal first
  bulkPaymentSubmission: undefined,
}

export const currentStudentFines = currentStudentFineRecord.fineItems.map(i => ({
  id: i.id,
  studentId: currentStudent.studentId,
  studentName: currentStudentFineRecord.studentName,
  reason: i.reason,
  amount: i.amount,
  status: (i.isWaived
    ? "waived"
    : currentStudentFineRecord.bulkPaymentSubmission?.status === "approved"
      ? "paid"
      : "unpaid") as "unpaid" | "paid" | "waived",
  dateIssued: i.issuedAt,
  datePaid: currentStudentFineRecord.bulkPaymentSubmission?.status === "approved"
    ? currentStudentFineRecord.bulkPaymentSubmission.dateOfPayment
    : undefined,
}))

export const currentStudentClearance: Clearance = {
  id: "demo-c1",
  studentId: currentStudent.studentId,
  studentName: `${currentStudent.firstName} ${currentStudent.lastName}`,
  academicYear: "2025-2026",
  semester: "2nd Semester",
  overallStatus: "not-cleared",
  requirements: [
    { name: "Fees", status: "not-cleared" },
    { name: "Fines", status: "not-cleared" },
  ],
}

export const currentStudentAttendance: EventAttendance[] = [
  { id: "demo-ea1", eventId: "e1", studentId: currentStudent.studentId, studentName: `${currentStudent.firstName} ${currentStudent.lastName}`, eventName: "State of the Student Address: The Student Assembly",    status: "absent" },
  { id: "demo-ea2", eventId: "e2", studentId: currentStudent.studentId, studentName: `${currentStudent.firstName} ${currentStudent.lastName}`, eventName: "CS3 Assembly and Orientation", status: "present", timeIn: "14:00" },
  ]

export { events, currentStudentFees as fees }

export const GCASH_QR_CODE = "/qr-code.png"
export const GCASH_ACCOUNT_NAME = "University Supreme Student Council"
export const GCASH_ACCOUNT_NUMBER = "09123456789"
