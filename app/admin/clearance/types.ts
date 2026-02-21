export type ClearanceItemStatus = "cleared" | "pending" | "not-cleared"

export interface ClearanceRequirement {
  name: string
  status: ClearanceItemStatus
}

export interface Clearance {
  id: string
  studentId: string
  studentName: string
  academicYear: string
  semester: string
  requirements: ClearanceRequirement[]
  overallStatus: ClearanceItemStatus
}
