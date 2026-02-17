"use client"

import { useState } from "react"
import { Users, Search, Download, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/src/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/src/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog"
import { students as initialStudents } from "./mock-data"
import type { Student, StudentStatus } from "./types"
import { toast } from "sonner"
import { StatCard } from "@/components/stat-card"
import { Clock, UserX } from "lucide-react"

const statusVariant: Record<StudentStatus, "secondary" | "destructive" | "outline"> = {
  approved: "secondary",
  rejected: "destructive",
  pending: "outline",
}

export default function StudentsPage() {
  const [studentList, setStudentList] = useState<Student[]>(initialStudents)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterCourse, setFilterCourse] = useState<string>("all")

  const courses = Array.from(new Set(studentList.map(s => s.course)))

  const filtered = studentList.filter(s => {
    const matchesSearch =
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === "all" || s.status === filterStatus
    const matchesCourse = filterCourse === "all" || s.course === filterCourse
    return matchesSearch && matchesStatus && matchesCourse
  })

  const approved = studentList.filter(s => s.status === "approved").length
  const pending = studentList.filter(s => s.status === "pending").length
  const rejected = studentList.filter(s => s.status === "rejected").length

  function handleApprove(id: string) {
    setStudentList(prev => prev.map(s => s.id === id ? { ...s, status: "approved" as StudentStatus } : s))
    toast.success("Student registration approved")
  }

  function handleReject(id: string) {
    setStudentList(prev => prev.map(s => s.id === id ? { ...s, status: "rejected" as StudentStatus } : s))
    toast.success("Student registration rejected")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Student Management</h1>
        <p className="text-sm text-muted-foreground">Registration and approval of USSC members</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Approved" value={approved} description="Active members" icon={Users} />
        <StatCard title="Pending" value={pending} description="Awaiting approval" icon={Clock} />
        <StatCard title="Rejected" value={rejected} description="Declined registrations" icon={UserX} />
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base text-foreground">All Students</CardTitle>
              <CardDescription className="text-muted-foreground">{filtered.length} students found</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input placeholder="Search name, ID, or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 w-64" />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCourse} onValueChange={setFilterCourse}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Course" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Export started (mock)")}>
                <Download className="size-4" /> Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Year / Section</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="text-sm font-mono text-foreground">{s.studentId}</TableCell>
                    <TableCell className="text-sm font-medium text-foreground">{s.firstName} {s.lastName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.email}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.course}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.yearLevel} - {s.section}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[s.status]} className="capitalize">{s.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.registrationDate}</TableCell>
                    <TableCell className="text-right">
                      {s.status === "pending" && (
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="gap-1 text-success" onClick={() => handleApprove(s.id)}>
                            <CheckCircle className="size-3.5" /> Approve
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="gap-1 text-destructive">
                                <XCircle className="size-3.5" /> Reject
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Reject Registration</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to reject the registration for {s.firstName} {s.lastName} ({s.studentId})?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleReject(s.id)}>Reject</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">No students found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
