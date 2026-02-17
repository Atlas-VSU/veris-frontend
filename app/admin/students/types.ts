export type StudentStatus = "pending" | "approved" | "rejected"

export interface Student {
  id: string
  studentId: string
  firstName: string
  lastName: string
  email: string
  course: string
  yearLevel: number
  section: string
  status: StudentStatus
  registrationDate: string
  avatarUrl?: string
}
