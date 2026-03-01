import type { Clearance } from "./types"

// Clearances represent a student's overall compliance status for the current semester.
// Two requirement categories:
//   • Fees  — all compulsory fees must be settled
//   • Fines — all issued fines must be paid or waived
export const clearances: Clearance[] = [
  {
    id: "c1", studentId: "24-1-00101", studentName: "Maria Santos",
    overallStatus: "cleared",
    requirements: [
      { name: "Fees", status: "cleared", items: [
        { label: "Membership Fee", amount: 150, status: "cleared" },
        { label: "Community Outreach Fund", amount: 50, status: "cleared" },
      ]},
      { name: "Fines", status: "cleared", items: [] },
    ],
  },
  {
    id: "c2", studentId: "24-1-00102", studentName: "Juan Dela Cruz",
    overallStatus: "cleared",
    requirements: [
      { name: "Fees", status: "cleared", items: [
        { label: "Membership Fee", amount: 150, status: "cleared" },
        { label: "Community Outreach Fund", amount: 50, status: "cleared" },
      ]},
      { name: "Fines", status: "cleared", items: [] },
    ],
  },
  {
    id: "c3", studentId: "24-1-00103", studentName: "Angela Reyes",
    overallStatus: "pending",
    requirements: [
      { name: "Fees", status: "cleared", items: [
        { label: "Membership Fee", amount: 150, status: "cleared" },
        { label: "Community Outreach Fund", amount: 50, status: "cleared" },
      ]},
      { name: "Fines", status: "pending", items: [
        { label: "Absence Fine — General Assembly 2024", amount: 50, status: "pending",
          pendingPayment: { method: "GCash", referenceNo: "GC-2025-084321", amountPaid: 50, submittedAt: "Jan 28, 2026" } },
      ]},
    ],
  },
  {
    id: "c4", studentId: "24-1-00105", studentName: "Patricia Navarro",
    overallStatus: "not-cleared",
    requirements: [
      { name: "Fees", status: "not-cleared", items: [
        { label: "Membership Fee", amount: 150, status: "cleared" },
        { label: "Community Outreach Fund", amount: 50, status: "not-cleared" },
      ]},
      { name: "Fines", status: "cleared", items: [] },
    ],
  },
  {
    id: "c5", studentId: "24-1-00106", studentName: "Miguel Torres",
    overallStatus: "pending",
    requirements: [
      { name: "Fees", status: "pending", items: [
        { label: "Membership Fee", amount: 150, status: "pending",
          pendingPayment: {
            method: "Bank Transfer", referenceNo: "BT-2026-003817", amountPaid: 200, submittedAt: "Feb 10, 2026",
            coveredItems: [
              { label: "Membership Fee", amount: 150 },
              { label: "Community Outreach Fund", amount: 50 },
            ],
          } },
        { label: "Community Outreach Fund", amount: 50, status: "pending" },
      ]},
      { name: "Fines", status: "cleared", items: [] },
    ],
  },
  {
    id: "c6", studentId: "24-1-00108", studentName: "Rafael Mendoza",
    overallStatus: "cleared",
    requirements: [
      { name: "Fees", status: "cleared", items: [
        { label: "Membership Fee", amount: 150, status: "cleared" },
        { label: "Community Outreach Fund", amount: 50, status: "cleared" },
      ]},
      { name: "Fines", status: "cleared", items: [] },
    ],
  },
  {
    id: "c7", studentId: "24-1-00109", studentName: "Isabelle Cruz",
    overallStatus: "not-cleared",
    requirements: [
      { name: "Fees", status: "cleared", items: [
        { label: "Membership Fee", amount: 150, status: "cleared" },
        { label: "Community Outreach Fund", amount: 50, status: "cleared" },
      ]},
      { name: "Fines", status: "not-cleared", items: [
        { label: "Absence Fine — Leadership Summit", amount: 50, status: "not-cleared" },
        { label: "Late Payment Penalty", amount: 25, status: "not-cleared" },
      ]},
    ],
  },
  {
    id: "c8", studentId: "24-1-00110", studentName: "Daniel Villanueva",
    overallStatus: "not-cleared",
    requirements: [
      { name: "Fees", status: "not-cleared", items: [
        { label: "Membership Fee", amount: 150, status: "not-cleared" },
        { label: "Community Outreach Fund", amount: 50, status: "not-cleared" },
      ]},
      { name: "Fines", status: "not-cleared", items: [
        { label: "Absence Fine — General Assembly 2024", amount: 50, status: "not-cleared" },
      ]},
    ],
  },
  {
    id: "c9", studentId: "24-1-00111", studentName: "Camille Fernandez",
    overallStatus: "cleared",
    requirements: [
      { name: "Fees", status: "cleared", items: [
        { label: "Membership Fee", amount: 150, status: "cleared" },
        { label: "Community Outreach Fund", amount: 50, status: "cleared" },
      ]},
      { name: "Fines", status: "cleared", items: [] },
    ],
  },
  {
    id: "c10", studentId: "24-1-00113", studentName: "Bianca Rivera",
    overallStatus: "cleared",
    requirements: [
      { name: "Fees", status: "cleared", items: [
        { label: "Membership Fee", amount: 150, status: "cleared" },
        { label: "Community Outreach Fund", amount: 50, status: "cleared" },
      ]},
      { name: "Fines", status: "cleared", items: [] },
    ],
  },
  {
    id: "c11", studentId: "24-1-00114", studentName: "Lorenzo Aguilar",
    overallStatus: "pending",
    requirements: [
      { name: "Fees", status: "pending", items: [
        { label: "Membership Fee", amount: 150, status: "cleared" },
        { label: "Community Outreach Fund", amount: 50, status: "pending",
          pendingPayment: {
            method: "GCash", referenceNo: "GC-2026-019452", amountPaid: 100, submittedAt: "Feb 25, 2026",
            coveredItems: [
              { reqName: "Fees",  label: "Community Outreach Fund", amount: 50 },
              { reqName: "Fines", label: "Absence Fine — General Assembly 2024", amount: 50 },
            ],
          } },
      ]},
      { name: "Fines", status: "pending", items: [
        { label: "Absence Fine — General Assembly 2024", amount: 50, status: "pending" },
      ]},
    ],
  },
]
