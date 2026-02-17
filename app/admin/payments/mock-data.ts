import type { Payment } from "./types"

export const payments: Payment[] = [
  { id: "pay1", studentId: "2024-00103", studentName: "Angela Reyes", type: "fine", amount: 50, referenceCode: "GC-2024-11-150001", receiptImage: "/receipts/sample1.png", status: "pending", submittedDate: "2024-11-15", relatedId: "fn1" },
  { id: "pay2", studentId: "2024-00106", studentName: "Miguel Torres", type: "membership-fee", amount: 75, referenceCode: "GC-2024-07-200001", receiptImage: "/receipts/sample2.png", status: "approved", submittedDate: "2024-07-20", reviewedDate: "2024-07-21", reviewedBy: "Admin", relatedId: "f6" },
  { id: "pay3", studentId: "2024-00109", studentName: "Isabelle Cruz", type: "fine", amount: 50, referenceCode: "GC-2024-11-160001", receiptImage: "/receipts/sample3.png", status: "declined", submittedDate: "2024-11-16", reviewedDate: "2024-11-17", reviewedBy: "Admin", remarks: "Receipt image is unclear. Please resubmit with a clearer photo.", relatedId: "fn3" },
  { id: "pay4", studentId: "2024-00104", studentName: "Carlos Garcia", type: "membership-fee", amount: 150, referenceCode: "GC-2024-11-180001", receiptImage: "/receipts/sample4.png", status: "pending", submittedDate: "2024-11-18", relatedId: "f4" },
  { id: "pay5", studentId: "2024-00105", studentName: "Patricia Navarro", type: "fine", amount: 50, referenceCode: "GC-2024-11-190001", receiptImage: "/receipts/sample5.png", status: "approved", submittedDate: "2024-11-19", reviewedDate: "2024-11-20", reviewedBy: "Admin", relatedId: "fn8" },
  { id: "pay6", studentId: "2024-00118", studentName: "Lorenzo Perez", type: "fine", amount: 75, referenceCode: "GC-2024-11-260001", receiptImage: "/receipts/sample6.png", status: "pending", submittedDate: "2024-11-26", relatedId: "fn9" },
  { id: "pay7", studentId: "2024-00110", studentName: "Daniel Villanueva", type: "membership-fee", amount: 150, referenceCode: "GC-2024-11-100001", receiptImage: "/receipts/sample7.png", status: "declined", submittedDate: "2024-11-10", reviewedDate: "2024-11-12", reviewedBy: "Admin", remarks: "Amount paid does not match membership fee. Expected ₱150, received ₱100.", relatedId: "f10" },
]
