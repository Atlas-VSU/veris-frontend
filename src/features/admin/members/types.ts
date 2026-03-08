export type StudentStatus = "pending" | "approved" | "rejected"

export interface Student {
  id: string
  studentId: string
  firstName: string
  lastName: string
  email: string
  program: string
  yearLevel: number
  status: StudentStatus
  registrationDate: string
  avatarUrl?: string
}
