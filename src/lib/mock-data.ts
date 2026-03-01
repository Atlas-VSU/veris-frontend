import type {
  Student,
  MembershipFee,
  Event,
  EventAttendance,
  Fine,
  Clearance,
  FinancialSummary,
  Payment,
} from "./types"

// ── Students ──────────────────────────────────────────────────────
export const students: Student[] = [
  { id: "1", studentId: "2024-00101", firstName: "Maria", lastName: "Santos", email: "maria.santos@university.edu.ph", course: "BS Computer Science", yearLevel: 3, section: "A", status: "approved", registrationDate: "2024-06-15" },
  { id: "2", studentId: "2024-00102", firstName: "Juan", lastName: "Dela Cruz", email: "juan.delacruz@university.edu.ph", course: "BS Information Technology", yearLevel: 2, section: "B", status: "approved", registrationDate: "2024-06-16" },
  { id: "3", studentId: "2024-00103", firstName: "Angela", lastName: "Reyes", email: "angela.reyes@university.edu.ph", course: "BS Computer Science", yearLevel: 4, section: "A", status: "approved", registrationDate: "2024-06-15" },
  { id: "4", studentId: "2024-00104", firstName: "Carlos", lastName: "Garcia", email: "carlos.garcia@university.edu.ph", course: "BS Information Systems", yearLevel: 1, section: "C", status: "pending", registrationDate: "2024-08-20" },
  { id: "5", studentId: "2024-00105", firstName: "Patricia", lastName: "Navarro", email: "patricia.navarro@university.edu.ph", course: "BS Computer Science", yearLevel: 2, section: "B", status: "approved", registrationDate: "2024-06-17" },
  { id: "6", studentId: "2024-00106", firstName: "Miguel", lastName: "Torres", email: "miguel.torres@university.edu.ph", course: "BS Information Technology", yearLevel: 3, section: "A", status: "approved", registrationDate: "2024-06-18" },
  { id: "7", studentId: "2024-00107", firstName: "Sofia", lastName: "Bautista", email: "sofia.bautista@university.edu.ph", course: "BS Information Systems", yearLevel: 1, section: "A", status: "pending", registrationDate: "2024-08-22" },
  { id: "8", studentId: "2024-00108", firstName: "Rafael", lastName: "Mendoza", email: "rafael.mendoza@university.edu.ph", course: "BS Computer Science", yearLevel: 4, section: "B", status: "approved", registrationDate: "2024-06-15" },
  { id: "9", studentId: "2024-00109", firstName: "Isabelle", lastName: "Cruz", email: "isabelle.cruz@university.edu.ph", course: "BS Information Technology", yearLevel: 2, section: "A", status: "approved", registrationDate: "2024-06-19" },
  { id: "10", studentId: "2024-00110", firstName: "Daniel", lastName: "Villanueva", email: "daniel.villanueva@university.edu.ph", course: "BS Computer Science", yearLevel: 3, section: "C", status: "rejected", registrationDate: "2024-07-01" },
  { id: "11", studentId: "2024-00111", firstName: "Camille", lastName: "Fernandez", email: "camille.fernandez@university.edu.ph", course: "BS Information Systems", yearLevel: 2, section: "B", status: "approved", registrationDate: "2024-06-20" },
  { id: "12", studentId: "2024-00112", firstName: "Andrei", lastName: "Lopez", email: "andrei.lopez@university.edu.ph", course: "BS Computer Science", yearLevel: 1, section: "A", status: "pending", registrationDate: "2024-08-25" },
  { id: "13", studentId: "2024-00113", firstName: "Bianca", lastName: "Rivera", email: "bianca.rivera@university.edu.ph", course: "BS Information Technology", yearLevel: 4, section: "A", status: "approved", registrationDate: "2024-06-16" },
  { id: "14", studentId: "2024-00114", firstName: "Enrique", lastName: "Castillo", email: "enrique.castillo@university.edu.ph", course: "BS Computer Science", yearLevel: 3, section: "B", status: "approved", registrationDate: "2024-06-17" },
  { id: "15", studentId: "2024-00115", firstName: "Daniella", lastName: "Aquino", email: "daniella.aquino@university.edu.ph", course: "BS Information Systems", yearLevel: 2, section: "A", status: "approved", registrationDate: "2024-06-21" },
  { id: "16", studentId: "2024-00116", firstName: "Marco", lastName: "Ramos", email: "marco.ramos@university.edu.ph", course: "BS Information Technology", yearLevel: 1, section: "B", status: "pending", registrationDate: "2024-08-28" },
  { id: "17", studentId: "2024-00117", firstName: "Jasmine", lastName: "Gonzales", email: "jasmine.gonzales@university.edu.ph", course: "BS Computer Science", yearLevel: 4, section: "A", status: "approved", registrationDate: "2024-06-15" },
  { id: "18", studentId: "2024-00118", firstName: "Lorenzo", lastName: "Perez", email: "lorenzo.perez@university.edu.ph", course: "BS Information Systems", yearLevel: 3, section: "C", status: "approved", registrationDate: "2024-06-22" },
  { id: "19", studentId: "2024-00119", firstName: "Nicole", lastName: "Tan", email: "nicole.tan@university.edu.ph", course: "BS Information Technology", yearLevel: 2, section: "A", status: "approved", registrationDate: "2024-06-23" },
  { id: "20", studentId: "2024-00120", firstName: "Gabriel", lastName: "Lim", email: "gabriel.lim@university.edu.ph", course: "BS Computer Science", yearLevel: 1, section: "C", status: "pending", registrationDate: "2024-09-01" },
]

// ── Membership Fees ───────────────────────────────────────────────
export const membershipFees: MembershipFee[] = [
  { id: "f1", studentId: "2024-00101", studentName: "Maria Santos", amount: 150, semester: "1st Semester", academicYear: "2025-2026", status: "paid", paidDate: "2024-07-10", receiptNo: "USSC-2024-0001" },
  { id: "f2", studentId: "2024-00102", studentName: "Juan Dela Cruz", amount: 150, semester: "1st Semester", academicYear: "2025-2026", status: "paid", paidDate: "2024-07-12", receiptNo: "USSC-2024-0002" },
  { id: "f3", studentId: "2024-00103", studentName: "Angela Reyes", amount: 150, semester: "1st Semester", academicYear: "2025-2026", status: "paid", paidDate: "2024-07-11", receiptNo: "USSC-2024-0003" },
  { id: "f4", studentId: "2024-00104", studentName: "Carlos Garcia", amount: 150, semester: "1st Semester", academicYear: "2025-2026", status: "unpaid" },
  { id: "f5", studentId: "2024-00105", studentName: "Patricia Navarro", amount: 150, semester: "1st Semester", academicYear: "2025-2026", status: "paid", paidDate: "2024-07-15", receiptNo: "USSC-2024-0004" },
  { id: "f6", studentId: "2024-00106", studentName: "Miguel Torres", amount: 150, semester: "1st Semester", academicYear: "2025-2026", status: "partial", paidDate: "2024-07-20" },
  { id: "f7", studentId: "2024-00107", studentName: "Sofia Bautista", amount: 150, semester: "1st Semester", academicYear: "2025-2026", status: "unpaid" },
  { id: "f8", studentId: "2024-00108", studentName: "Rafael Mendoza", amount: 150, semester: "1st Semester", academicYear: "2025-2026", status: "paid", paidDate: "2024-07-08", receiptNo: "USSC-2024-0005" },
  { id: "f9", studentId: "2024-00109", studentName: "Isabelle Cruz", amount: 150, semester: "1st Semester", academicYear: "2025-2026", status: "paid", paidDate: "2024-07-18", receiptNo: "USSC-2024-0006" },
  { id: "f10", studentId: "2024-00110", studentName: "Daniel Villanueva", amount: 150, semester: "1st Semester", academicYear: "2025-2026", status: "unpaid" },
  { id: "f11", studentId: "2024-00111", studentName: "Camille Fernandez", amount: 150, semester: "1st Semester", academicYear: "2025-2026", status: "paid", paidDate: "2024-07-22", receiptNo: "USSC-2024-0007" },
  { id: "f12", studentId: "2024-00112", studentName: "Andrei Lopez", amount: 150, semester: "1st Semester", academicYear: "2025-2026", status: "unpaid" },
  { id: "f13", studentId: "2024-00113", studentName: "Bianca Rivera", amount: 150, semester: "1st Semester", academicYear: "2025-2026", status: "paid", paidDate: "2024-07-09", receiptNo: "USSC-2024-0008" },
  { id: "f14", studentId: "2024-00114", studentName: "Enrique Castillo", amount: 150, semester: "1st Semester", academicYear: "2025-2026", status: "partial", paidDate: "2024-07-25" },
  { id: "f15", studentId: "2024-00115", studentName: "Daniella Aquino", amount: 150, semester: "1st Semester", academicYear: "2025-2026", status: "paid", paidDate: "2024-07-14", receiptNo: "USSC-2024-0009" },
  { id: "f16", studentId: "2024-00116", studentName: "Marco Ramos", amount: 150, semester: "1st Semester", academicYear: "2025-2026", status: "unpaid" },
  { id: "f17", studentId: "2024-00117", studentName: "Jasmine Gonzales", amount: 150, semester: "1st Semester", academicYear: "2025-2026", status: "paid", paidDate: "2024-07-07", receiptNo: "USSC-2024-0010" },
  { id: "f18", studentId: "2024-00118", studentName: "Lorenzo Perez", amount: 150, semester: "1st Semester", academicYear: "2025-2026", status: "paid", paidDate: "2024-07-19", receiptNo: "USSC-2024-0011" },
  { id: "f19", studentId: "2024-00119", studentName: "Nicole Tan", amount: 150, semester: "1st Semester", academicYear: "2025-2026", status: "paid", paidDate: "2024-07-16", receiptNo: "USSC-2024-0012" },
  { id: "f20", studentId: "2024-00120", studentName: "Gabriel Lim", amount: 150, semester: "1st Semester", academicYear: "2025-2026", status: "unpaid" },
]

// ── Events ────────────────────────────────────────────────────────
export const events: Event[] = [
  { id: "e1", name: "General Assembly 2024", description: "Annual general assembly for all USSC members. Attendance is mandatory.", date: "2024-09-15", location: "University Auditorium", type: "general-assembly", attendeesCount: 156, totalStudents: 200 },
  { id: "e2", name: "Leadership Seminar", description: "Seminar on student leadership and governance.", date: "2024-10-05", location: "Conference Hall A", type: "seminar", attendeesCount: 89, totalStudents: 120 },
  { id: "e3", name: "Tech Workshop: Web Dev", description: "Hands-on workshop on modern web development technologies.", date: "2024-10-20", location: "Computer Lab 3", type: "workshop", attendeesCount: 45, totalStudents: 50 },
  { id: "e4", name: "USSC Welcome Party", description: "Welcome party for new members and freshmen.", date: "2024-08-30", location: "University Grounds", type: "social", attendeesCount: 178, totalStudents: 200 },
  { id: "e5", name: "Budget Planning Meeting", description: "Quarterly budget review and planning session.", date: "2024-11-10", location: "Meeting Room 2", type: "meeting", attendeesCount: 12, totalStudents: 15 },
  { id: "e6", name: "Community Outreach", description: "Community service and outreach program.", date: "2024-11-25", location: "Barangay Hall", type: "social", attendeesCount: 67, totalStudents: 80 },
]

// ── Event Attendance ──────────────────────────────────────────────
export const eventAttendance: EventAttendance[] = [
  { id: "ea1", eventId: "e1", eventName: "General Assembly 2024", studentId: "2024-00101", studentName: "Maria Santos", status: "present", timeIn: "08:30" },
  { id: "ea2", eventId: "e1", eventName: "General Assembly 2024", studentId: "2024-00102", studentName: "Juan Dela Cruz", status: "present", timeIn: "08:45" },
  { id: "ea3", eventId: "e1", eventName: "General Assembly 2024", studentId: "2024-00103", studentName: "Angela Reyes", status: "absent" },
  { id: "ea4", eventId: "e1", eventName: "General Assembly 2024", studentId: "2024-00105", studentName: "Patricia Navarro", status: "present", timeIn: "08:15" },
  { id: "ea5", eventId: "e1", eventName: "General Assembly 2024", studentId: "2024-00106", studentName: "Miguel Torres", status: "excused" },
  { id: "ea6", eventId: "e2", eventName: "Leadership Seminar", studentId: "2024-00101", studentName: "Maria Santos", status: "present", timeIn: "09:00" },
  { id: "ea7", eventId: "e2", eventName: "Leadership Seminar", studentId: "2024-00108", studentName: "Rafael Mendoza", status: "present", timeIn: "09:10" },
  { id: "ea8", eventId: "e2", eventName: "Leadership Seminar", studentId: "2024-00109", studentName: "Isabelle Cruz", status: "absent" },
  { id: "ea9", eventId: "e3", eventName: "Tech Workshop: Web Dev", studentId: "2024-00101", studentName: "Maria Santos", status: "present", timeIn: "13:00" },
  { id: "ea10", eventId: "e3", eventName: "Tech Workshop: Web Dev", studentId: "2024-00102", studentName: "Juan Dela Cruz", status: "present", timeIn: "13:05" },
  { id: "ea11", eventId: "e3", eventName: "Tech Workshop: Web Dev", studentId: "2024-00114", studentName: "Enrique Castillo", status: "present", timeIn: "12:55" },
  { id: "ea12", eventId: "e4", eventName: "USSC Welcome Party", studentId: "2024-00101", studentName: "Maria Santos", status: "present", timeIn: "17:00" },
  { id: "ea13", eventId: "e4", eventName: "USSC Welcome Party", studentId: "2024-00105", studentName: "Patricia Navarro", status: "present", timeIn: "17:15" },
  { id: "ea14", eventId: "e4", eventName: "USSC Welcome Party", studentId: "2024-00113", studentName: "Bianca Rivera", status: "present", timeIn: "17:30" },
  { id: "ea15", eventId: "e6", eventName: "Community Outreach", studentId: "2024-00101", studentName: "Maria Santos", status: "present", timeIn: "07:00" },
  { id: "ea16", eventId: "e6", eventName: "Community Outreach", studentId: "2024-00106", studentName: "Miguel Torres", status: "present", timeIn: "07:10" },
]

// ── Fines ─────────────────────────────────────────────────────────
// Fines can be auto-generated when students are marked absent from mandatory events.
// Auto-generated fines have `autoGenerated: true` and `eventId` set to the event.
// In a real application, the backend would automatically create fines for absent students
// after an event concludes and attendance is finalized.
export const fines: Fine[] = [
  { id: "fn1", studentId: "2024-00103", studentName: "Angela Reyes", reason: "Absent - General Assembly 2024", amount: 50, status: "unpaid", dateIssued: "2024-09-16", eventId: "e1", autoGenerated: true },
  { id: "fn2", studentId: "2024-00106", studentName: "Miguel Torres", reason: "Late submission of requirements", amount: 25, status: "paid", dateIssued: "2024-09-20", datePaid: "2024-09-25", autoGenerated: false },
  { id: "fn3", studentId: "2024-00109", studentName: "Isabelle Cruz", reason: "Absent - Leadership Seminar", amount: 50, status: "unpaid", dateIssued: "2024-10-06", eventId: "e2", autoGenerated: true },
  { id: "fn4", studentId: "2024-00110", studentName: "Daniel Villanueva", reason: "Absent - General Assembly 2024", amount: 50, status: "unpaid", dateIssued: "2024-09-16", eventId: "e1", autoGenerated: true },
  { id: "fn5", studentId: "2024-00110", studentName: "Daniel Villanueva", reason: "Absent - USSC Welcome Party", amount: 50, status: "unpaid", dateIssued: "2024-09-01", eventId: "e4", autoGenerated: true },
  { id: "fn6", studentId: "2024-00102", studentName: "Juan Dela Cruz", reason: "Late payment of membership fee", amount: 25, status: "paid", dateIssued: "2024-08-01", datePaid: "2024-08-05", autoGenerated: false },
  { id: "fn7", studentId: "2024-00114", studentName: "Enrique Castillo", reason: "Violation of event guidelines", amount: 100, status: "waived", dateIssued: "2024-10-21", autoGenerated: false },
  { id: "fn8", studentId: "2024-00105", studentName: "Patricia Navarro", reason: "Absent - Budget Planning Meeting", amount: 50, status: "unpaid", dateIssued: "2024-11-11", eventId: "e5", autoGenerated: true },
  { id: "fn9", studentId: "2024-00118", studentName: "Lorenzo Perez", reason: "Absent - Community Outreach", amount: 75, status: "unpaid", dateIssued: "2024-11-26", eventId: "e6", autoGenerated: true },
  { id: "fn10", studentId: "2024-00111", studentName: "Camille Fernandez", reason: "Late submission of clearance docs", amount: 25, status: "paid", dateIssued: "2024-10-15", datePaid: "2024-10-20", autoGenerated: false },
]

// ── Clearance ─────────────────────────────────────────────────────
// Clearances represent a student's overall compliance status for academic purposes.
// Requirements are checked against actual data:
// - "Membership Fee": Student must have paid membership fee (status "paid")
// - "Fines": Student must have no unpaid fines (all fines "paid" or "waived")
// - "Event Attendance (Min. 3)": Student must attend at least 3 events
// - "Community Service": Separate tracking (not shown in this mock)
//
// In a real application, the backend would automatically calculate each requirement's
// status based on the related data (fees, fines, attendance records).
// For this mock data, requirements are manually set to be consistent with the data above.
export const clearances: Clearance[] = [
  { id: "c1", studentId: "2024-00101", studentName: "Maria Santos", academicYear: "2025-2026", semester: "1st Semester", overallStatus: "cleared", requirements: [
    { name: "Membership Fee", status: "cleared" }, { name: "Fines", status: "cleared" }, { name: "Event Attendance (Min. 3)", status: "cleared" }, { name: "Community Service", status: "cleared" },
  ]},
  { id: "c2", studentId: "2024-00102", studentName: "Juan Dela Cruz", academicYear: "2025-2026", semester: "1st Semester", overallStatus: "cleared", requirements: [
    { name: "Membership Fee", status: "cleared" }, { name: "Fines", status: "cleared" }, { name: "Event Attendance (Min. 3)", status: "cleared" }, { name: "Community Service", status: "pending" },
  ]},
  { id: "c3", studentId: "2024-00103", studentName: "Angela Reyes", academicYear: "2025-2026", semester: "1st Semester", overallStatus: "not-cleared", requirements: [
    { name: "Membership Fee", status: "cleared" }, { name: "Fines", status: "not-cleared" }, { name: "Event Attendance (Min. 3)", status: "pending" }, { name: "Community Service", status: "pending" },
  ]},
  { id: "c4", studentId: "2024-00105", studentName: "Patricia Navarro", academicYear: "2025-2026", semester: "1st Semester", overallStatus: "pending", requirements: [
    { name: "Membership Fee", status: "cleared" }, { name: "Fines", status: "not-cleared" }, { name: "Event Attendance (Min. 3)", status: "cleared" }, { name: "Community Service", status: "cleared" },
  ]},
  { id: "c5", studentId: "2024-00106", studentName: "Miguel Torres", academicYear: "2025-2026", semester: "1st Semester", overallStatus: "pending", requirements: [
    { name: "Membership Fee", status: "pending" }, { name: "Fines", status: "cleared" }, { name: "Event Attendance (Min. 3)", status: "cleared" }, { name: "Community Service", status: "cleared" },
  ]},
  { id: "c6", studentId: "2024-00108", studentName: "Rafael Mendoza", academicYear: "2025-2026", semester: "1st Semester", overallStatus: "cleared", requirements: [
    { name: "Membership Fee", status: "cleared" }, { name: "Fines", status: "cleared" }, { name: "Event Attendance (Min. 3)", status: "cleared" }, { name: "Community Service", status: "cleared" },
  ]},
  { id: "c7", studentId: "2024-00109", studentName: "Isabelle Cruz", academicYear: "2025-2026", semester: "1st Semester", overallStatus: "not-cleared", requirements: [
    { name: "Membership Fee", status: "cleared" }, { name: "Fines", status: "not-cleared" }, { name: "Event Attendance (Min. 3)", status: "pending" }, { name: "Community Service", status: "pending" },
  ]},
  { id: "c8", studentId: "2024-00110", studentName: "Daniel Villanueva", academicYear: "2025-2026", semester: "1st Semester", overallStatus: "not-cleared", requirements: [
    { name: "Membership Fee", status: "not-cleared" }, { name: "Fines", status: "not-cleared" }, { name: "Event Attendance (Min. 3)", status: "not-cleared" }, { name: "Community Service", status: "not-cleared" },
  ]},
  { id: "c9", studentId: "2024-00111", studentName: "Camille Fernandez", academicYear: "2025-2026", semester: "1st Semester", overallStatus: "cleared", requirements: [
    { name: "Membership Fee", status: "cleared" }, { name: "Fines", status: "cleared" }, { name: "Event Attendance (Min. 3)", status: "cleared" }, { name: "Community Service", status: "cleared" },
  ]},
  { id: "c10", studentId: "2024-00113", studentName: "Bianca Rivera", academicYear: "2025-2026", semester: "1st Semester", overallStatus: "cleared", requirements: [
    { name: "Membership Fee", status: "cleared" }, { name: "Fines", status: "cleared" }, { name: "Event Attendance (Min. 3)", status: "cleared" }, { name: "Community Service", status: "cleared" },
  ]},
]

// ── Financial Summary ─────────────────────────────────────────────
export const financialSummary: FinancialSummary = {
  totalCollected: 1800,
  totalFines: 500,
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
    { status: "Unpaid", count: 5 },
    { status: "Paid", count: 3 },
    { status: "Waived", count: 1 },
  ],
}

// ── Payments ──────────────────────────────────────────────────────
// Payment submissions from students with proof of payment
export const payments: Payment[] = [
  { id: "pay1", studentId: "2024-00103", studentName: "Angela Reyes", type: "fine", amount: 50, referenceCode: "GC-2024-11-150001", receiptImage: "/receipts/sample1.png", status: "pending", submittedDate: "2024-11-15", relatedId: "fn1" },
  { id: "pay2", studentId: "2024-00106", studentName: "Miguel Torres", type: "membership-fee", amount: 75, referenceCode: "GC-2024-07-200001", receiptImage: "/receipts/sample2.png", status: "approved", submittedDate: "2024-07-20", reviewedDate: "2024-07-21", reviewedBy: "Admin", relatedId: "f6" },
  { id: "pay3", studentId: "2024-00109", studentName: "Isabelle Cruz", type: "fine", amount: 50, referenceCode: "GC-2024-11-160001", receiptImage: "/receipts/sample3.png", status: "declined", submittedDate: "2024-11-16", reviewedDate: "2024-11-17", reviewedBy: "Admin", remarks: "Receipt image is unclear. Please resubmit with a clearer photo.", relatedId: "fn3" },
  { id: "pay4", studentId: "2024-00104", studentName: "Carlos Garcia", type: "membership-fee", amount: 150, referenceCode: "GC-2024-11-180001", receiptImage: "/receipts/sample4.png", status: "pending", submittedDate: "2024-11-18", relatedId: "f4" },
  { id: "pay5", studentId: "2024-00105", studentName: "Patricia Navarro", type: "fine", amount: 50, referenceCode: "GC-2024-11-190001", receiptImage: "/receipts/sample5.png", status: "approved", submittedDate: "2024-11-19", reviewedDate: "2024-11-20", reviewedBy: "Admin", relatedId: "fn8" },
  { id: "pay6", studentId: "2024-00118", studentName: "Lorenzo Perez", type: "fine", amount: 75, referenceCode: "GC-2024-11-260001", receiptImage: "/receipts/sample6.png", status: "pending", submittedDate: "2024-11-26", relatedId: "fn9" },
  { id: "pay7", studentId: "2024-00110", studentName: "Daniel Villanueva", type: "membership-fee", amount: 150, referenceCode: "GC-2024-11-100001", receiptImage: "/receipts/sample7.png", status: "declined", submittedDate: "2024-11-10", reviewedDate: "2024-11-12", reviewedBy: "Admin", remarks: "Amount paid does not match membership fee. Expected ₱150, received ₱100.", relatedId: "f10" },
]

// ── Constants ─────────────────────────────────────────────────────
export const GCASH_QR_CODE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" // Placeholder QR code
export const GCASH_ACCOUNT_NAME = "University Supreme Student Council"
export const GCASH_ACCOUNT_NUMBER = "09123456789"

// ── Helper: get current student for portal (mock logged-in user) ──
export const currentStudent = students[2] // change accordingly to test different students
export const currentStudentFees = membershipFees.filter(f => f.studentId === currentStudent.studentId)
export const currentStudentFines = fines.filter(f => f.studentId === currentStudent.studentId)
export const currentStudentClearance = clearances.find(c => c.studentId === currentStudent.studentId)
export const currentStudentAttendance = eventAttendance.filter(a => a.studentId === currentStudent.studentId)
export const currentStudentPayments = payments.filter(p => p.studentId === currentStudent.studentId)

// ── Helper: Clearance Requirement Checkers ────────────────────────
// These functions determine clearance requirement status based on actual data.
// In a production app, these would be implemented in the backend.

/**
 * Check if a student's membership fee requirement is cleared
 * A student is cleared if they have paid their membership fee
 */
export function checkMembershipFeeCleared(studentId: string): boolean {
  const studentFees = membershipFees.filter(f => f.studentId === studentId)
  return studentFees.some(f => f.status === "paid")
}

/**
 * Check if a student's fines requirement is cleared
 * A student is cleared if they have NO unpaid fines
 */
export function checkFinesCleared(studentId: string): boolean {
  const studentFines = fines.filter(f => f.studentId === studentId)
  const hasUnpaidFines = studentFines.some(f => f.status === "unpaid")
  return !hasUnpaidFines
}

/**
 * Check if a student's event attendance requirement is met
 * A student must attend at least `minAttendance` events
 */
export function checkEventAttendanceCleared(studentId: string, minAttendance: number = 3): boolean {
  const studentAttendance = eventAttendance.filter(a => a.studentId === studentId && a.status === "present")
  return studentAttendance.length >= minAttendance
}

/**
 * Get the overall clearance status based on all requirements
 * - "cleared": all requirements are cleared
 * - "not-cleared": at least one requirement is not-cleared
 * - "pending": all other cases
 */
export function getOverallClearanceStatus(requirements: { status: string }[]): "cleared" | "not-cleared" | "pending" {
  const allCleared = requirements.every(r => r.status === "cleared")
  const anyNotCleared = requirements.some(r => r.status === "not-cleared")
  return allCleared ? "cleared" : anyNotCleared ? "not-cleared" : "pending"
}

