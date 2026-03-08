import type { Fee, PaymentLog } from "./types"

export const fees: Fee[] = [
  {
    id: "fee-1",
    title: "2nd Semester USSC Membership Fee",
    description: "Annual USSC membership fee for 2nd semester A.Y. 2025-2026.",
    type: "semestral-membership",
    amount: 100,
    academicYear: "2025-2026",
    semester: "2nd Semester",
    createdAt: "2026-07-01",
    totalStudents: 20,
    paidCount: 10,
  },
]

export const paymentLogs: PaymentLog[] = [
  // --- fee-1: 2nd Semester USSC Membership Fee ---
  { id: "pl1",  feeId: "fee-1", feeName: "2nd Semester USSC Membership Fee", studentId: "22-1-00101", studentName: "Maria Santos",      status: "pending_verification", amountPaid: 100, paymentMethod: null, gcashReferenceNumber: "GC-2026-07-100001", receiptImage: "/receipts/sample1.png",  paidAt: "2026-07-10", verifiedBy: "Admin", verifiedAt: "2026-07-11" },
  { id: "pl2",  feeId: "fee-1", feeName: "2nd Semester USSC Membership Fee", studentId: "21-1-00102", studentName: "Juan Dela Cruz",    status: "pending_verification", amountPaid: 100, paymentMethod: null, gcashReferenceNumber: "GC-2026-07-120001", receiptImage: "/receipts/sample2.png",  paidAt: "2026-07-12", verifiedBy: "Admin", verifiedAt: "2026-07-13" },
  { id: "pl3",  feeId: "fee-1", feeName: "2nd Semester USSC Membership Fee", studentId: "20-1-00103", studentName: "Angela Reyes",      status: "verified",             amountPaid: 100, paymentMethod: "gcash", gcashReferenceNumber: "GC-2026-07-110001", receiptImage: "/receipts/sample3.png",  paidAt: "2026-07-11", verifiedBy: "Admin", verifiedAt: "2026-07-12" },
  { id: "pl4",  feeId: "fee-1", feeName: "2nd Semester USSC Membership Fee", studentId: "22-1-00104", studentName: "Carlos Garcia",     status: "pending_verification", amountPaid: 100, paymentMethod: "gcash", gcashReferenceNumber: "GC-2026-11-180001", receiptImage: "/receipts/sample4.png",  paidAt: "2026-11-18" },
  { id: "pl5",  feeId: "fee-1", feeName: "2nd Semester USSC Membership Fee", studentId: "23-1-00105", studentName: "Patricia Navarro",  status: "verified",             amountPaid: 100, paymentMethod: "gcash", gcashReferenceNumber: "GC-2026-07-100001", receiptImage: "/receipts/sample5.png",  paidAt: "2026-₀7-₁₅", verifiedBy: "Admin", verifiedAt: "2026-07-09" },
  { id: "pl6",  feeId: "fee-1", feeName: "2nd Semester USSC Membership Fee", studentId: "19-1-00106", studentName: "Miguel Torres",     status: "pending_verification", amountPaid: 75,  paymentMethod: "gcash", gcashReferenceNumber: "GC-2026-07-200001", receiptImage: "/receipts/sample6.png",  paidAt: "2026-07-20" },
  { id: "pl7",  feeId: "fee-1", feeName: "2nd Semester USSC Membership Fee", studentId: "19-1-00107", studentName: "Sofia Bautista",    status: "rejected",             amountPaid: 100, paymentMethod: "gcash", gcashReferenceNumber: "GC-2026-08-220001", receiptImage: "/receipts/sample7.png",  paidAt: "2026-08-22", rejectionReason: "Receipt image is unclear. Please resubmit with a clearer photo." },
  { id: "pl8",  feeId: "fee-1", feeName: "2nd Semester USSC Membership Fee", studentId: "25-1-00108", studentName: "Rafael Mendoza",    status: "verified",             amountPaid: 100, paymentMethod: "gcash", gcashReferenceNumber: "GC-2026-07-080001", receiptImage: "/receipts/sample8.png",  paidAt: "2026-07-08", verifiedBy: "Admin", verifiedAt: "2026-07-09" },
  { id: "pl9",  feeId: "fee-1", feeName: "2nd Semester USSC Membership Fee", studentId: "21-1-00109", studentName: "Isabelle Cruz",     status: "verified",             amountPaid: 100, paymentMethod: "gcash", gcashReferenceNumber: "GC-2026-07-180001", receiptImage: "/receipts/sample9.png",  paidAt: "2026-07-18", verifiedBy: "Admin", verifiedAt: "2026-07-19" },
  { id: "pl10", feeId: "fee-1", feeName: "2nd Semester USSC Membership Fee", studentId: "22-1-00110", studentName: "Daniel Villanueva", status: "rejected",             amountPaid: 100, paymentMethod: "gcash", gcashReferenceNumber: "GC-2026-11-100001", receiptImage: "/receipts/sample10.png", paidAt: "2026-11-10", rejectionReason: "Amount paid does not match fee. Expected ₱100, received ₱100." },
  { id: "pl11", feeId: "fee-1", feeName: "2nd Semester USSC Membership Fee", studentId: "21-1-00111", studentName: "Camille Fernandez", status: "verified",             amountPaid: 100, paymentMethod: "gcash", gcashReferenceNumber: "GC-2026-07-220001", receiptImage: "/receipts/sample11.png", paidAt: "2026-07-22", verifiedBy: "Admin", verifiedAt: "2026-07-23" },
  { id: "pl13", feeId: "fee-1", feeName: "2nd Semester USSC Membership Fee", studentId: "24-1-00113", studentName: "Bianca Rivera",     status: "verified",             amountPaid: 100, paymentMethod: "gcash", gcashReferenceNumber: "GC-2026-07-090001", receiptImage: "/receipts/sample13.png", paidAt: "2026-07-09", verifiedBy: "Admin", verifiedAt: "2026-07-10" },
  { id: "pl15", feeId: "fee-1", feeName: "2nd Semester USSC Membership Fee", studentId: "24-1-00115", studentName: "Daniella Aquino",   status: "verified",             amountPaid: 100, paymentMethod: "gcash", gcashReferenceNumber: "GC-2026-07-140001", receiptImage: "/receipts/sample15.png", paidAt: "2026-07-14", verifiedBy: "Admin", verifiedAt: "2026-07-15" },
  { id: "pl17", feeId: "fee-1", feeName: "2nd Semester USSC Membership Fee", studentId: "24-1-00117", studentName: "Jasmine Gonzales",  status: "verified",             amountPaid: 100, paymentMethod: "gcash", gcashReferenceNumber: "GC-2026-07-070001", receiptImage: "/receipts/sample17.png", paidAt: "2026-07-07", verifiedBy: "Admin", verifiedAt: "2026-07-08" },

  /*
  
  // --- fee-2: Community Outreach Charity Fee ---
  { id: "pl20", feeId: "fee-2", feeName: "Community Outreach Charity Fee", studentId: "22-1-00101", studentName: "Maria Santos",    status: "verified",             amountPaid: 50, paymentMethod: "cash",  receiptImage: "/receipts/sample20.png", paidAt: "2026-10-20", verifiedBy: "Admin", verifiedAt: "2026-10-21" },
  { id: "pl21", feeId: "fee-2", feeName: "Community Outreach Charity Fee", studentId: "22-1-00102", studentName: "Juan Dela Cruz",  status: "verified",             amountPaid: 50, paymentMethod: "gcash", gcashReferenceNumber: "GC-2026-10-210001", receiptImage: "/receipts/sample21.png", paidAt: "2026-10-21", verifiedBy: "Admin", verifiedAt: "2026-10-22" },
  { id: "pl22", feeId: "fee-2", feeName: "Community Outreach Charity Fee", studentId: "22-1-00103", studentName: "Angela Reyes",    status: "pending_verification", amountPaid: 50, paymentMethod: "gcash", gcashReferenceNumber: "GC-2026-10-220001", receiptImage: "/receipts/sample22.png", paidAt: "2026-10-22" },
  { id: "pl23", feeId: "fee-2", feeName: "Community Outreach Charity Fee", studentId: "22-1-00105", studentName: "Patricia Navarro",status: "verified",             amountPaid: 50, paymentMethod: "gcash", gcashReferenceNumber: "GC-2026-10-230001", receiptImage: "/receipts/sample23.png", paidAt: "2026-10-23", verifiedBy: "Admin", verifiedAt: "2026-10-24" },
  { id: "pl24", feeId: "fee-2", feeName: "Community Outreach Charity Fee", studentId: "22-1-00108", studentName: "Rafael Mendoza",  status: "rejected",             amountPaid: 50, paymentMethod: "gcash", gcashReferenceNumber: "GC-2026-10-240001", receiptImage: "/receipts/sample24.png", paidAt: "2026-10-24", rejectionReason: "Duplicate submission. This reference number was already used." },

  // --- fee-3: State of the Student Address Event Fee ---
  { id: "pl30", feeId: "fee-3", feeName: "State of the Student Address Event Fee", studentId: "22-1-00101", studentName: "Maria Santos",    status: "verified",             amountPaid: 30, paymentMethod: "cash",  receiptImage: "/receipts/sample30.png", paidAt: "2026-09-10", verifiedBy: "Admin", verifiedAt: "2026-09-11" },
  { id: "pl31", feeId: "fee-3", feeName: "State of the Student Address Event Fee", studentId: "22-1-00102", studentName: "Juan Dela Cruz",  status: "verified",             amountPaid: 30, paymentMethod: "gcash", gcashReferenceNumber: "GC-2026-09-100001", receiptImage: "/receipts/sample31.png", paidAt: "2026-09-10", verifiedBy: "Admin", verifiedAt: "2026-09-11" },
  { id: "pl32", feeId: "fee-3", feeName: "State of the Student Address Event Fee", studentId: "22-1-00104", studentName: "Carlos Garcia",   status: "pending_verification", amountPaid: 30, paymentMethod: "gcash", gcashReferenceNumber: "GC-2026-09-120001", receiptImage: "/receipts/sample32.png", paidAt: "2026-09-12" },

  // --- fee-4: Organization Development Fund ---
  { id: "pl40", feeId: "fee-4", feeName: "Organization Development Fund", studentId: "22-1-00101", studentName: "Maria Santos",  status: "verified",             amountPaid: 100, paymentMethod: "gcash", gcashReferenceNumber: "GC-2025-01-100001", receiptImage: "/receipts/sample40.png", paidAt: "2025-01-15", verifiedBy: "Admin", verifiedAt: "2025-01-16" },
  { id: "pl41", feeId: "fee-4", feeName: "Organization Development Fund", studentId: "22-1-00103", studentName: "Angela Reyes",  status: "pending_verification", amountPaid: 100, paymentMethod: "gcash", gcashReferenceNumber: "GC-2025-01-200001", receiptImage: "/receipts/sample41.png", paidAt: "2025-01-20" },
  { id: "pl42", feeId: "fee-4", feeName: "Organization Development Fund", studentId: "22-1-00109", studentName: "Isabelle Cruz", status: "rejected",             amountPaid: 100, paymentMethod: "gcash", gcashReferenceNumber: "GC-2025-01-180001", receiptImage: "/receipts/sample42.png", paidAt: "2025-01-18", rejectionReason: "GCash reference number is invalid. Please verify and resubmit." },

  */
]
