"use client"

import { useState } from "react"
import { Users, Download, CheckCircle, XCircle, Eye } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { PageHeader } from "@/components/PageHeader"
import { SearchInput } from "@/components/SearchInput"
import { ViewToggle } from "@/components/ViewToggle"
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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/src/components/ui/dialog"
import { Separator } from "@/src/components/ui/separator"
import { students as initialStudents } from "./mock-data"
import type { Student, StudentStatus } from "./types"
import { toast } from "sonner"
import { StatCard } from "@/components/StatCard"
import { DataPagination } from "@/components/DataPagination"
import { Clock, UserX } from "lucide-react"

const ITEMS_PER_PAGE = 10

const statusVariant: Record<StudentStatus, "secondary" | "destructive" | "outline"> = {
  approved: "secondary",
  rejected: "destructive",
  pending: "outline",
}

const yearLabel = (y: number) => {
  const labels: Record<number, string> = { 1: "1st Year", 2: "2nd Year", 3: "3rd Year", 4: "4th Year" }
  return labels[y] ?? `Year ${y}`
}

type ViewMode = "table" | "card"

export default function StudentsPage() {
  const [studentList, setStudentList] = useState<Student[]>(initialStudents)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterProgram, setFilterProgram] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewStudent, setViewStudent] = useState<Student | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("table")

  const programs = Array.from(new Set(studentList.map(s => s.program)))

  const filtered = studentList.filter(s => {
    const matchesSearch =
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === "all" || s.status === filterStatus
    const matchesProgram = filterProgram === "all" || s.program === filterProgram
    return matchesSearch && matchesStatus && matchesProgram
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const approved = studentList.filter(s => s.status === "approved").length
  const pending = studentList.filter(s => s.status === "pending").length
  const rejected = studentList.filter(s => s.status === "rejected").length

  function handleApprove(id: string) {
    setStudentList(prev => prev.map(s => s.id === id ? { ...s, status: "approved" as StudentStatus } : s))
    setViewStudent(prev => prev?.id === id ? { ...prev, status: "approved" } : prev)
    toast.success("Student registration approved")
  }

  function handleReject(id: string) {
    setStudentList(prev => prev.map(s => s.id === id ? { ...s, status: "rejected" as StudentStatus } : s))
    setViewStudent(prev => prev?.id === id ? { ...prev, status: "rejected" } : prev)
    toast.success("Student registration rejected")
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Student Management"
        context="2nd Semester · A.Y. 2025–2026"
        description="Registration and approval of USSC members"
      />

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
              <SearchInput
                placeholder="Search name, ID, or email..."
                value={search}
                onChange={v => { setSearch(v); setCurrentPage(1) }}
                className="w-64"
              />
              <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterProgram} onValueChange={v => { setFilterProgram(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Program" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {programs.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Export started (mock)")}>
                <Download className="size-4" /> Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="text-sm font-mono text-foreground">{s.studentId}</TableCell>
                      <TableCell className="text-sm font-medium text-foreground">{s.firstName} {s.lastName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.email}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.program}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{yearLabel(s.yearLevel)}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[s.status]} className="capitalize">{s.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.registrationDate}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="gap-1" onClick={() => setViewStudent(s)}>
                          <Eye className="size-3.5" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginated.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">No students found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map(s => (
                <div
                  key={s.id}
                  className="flex flex-col gap-3 rounded-lg border border-border p-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{s.firstName} {s.lastName}</p>
                      <p className="text-xs font-mono text-muted-foreground">{s.studentId}</p>
                    </div>
                    <Badge variant={statusVariant[s.status]} className="capitalize shrink-0">{s.status}</Badge>
                  </div>
                  <Separator />
                  <dl className="flex flex-col gap-1.5 text-xs">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Email</dt>
                      <dd className="text-foreground truncate max-w-[60%] text-right">{s.email}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Program</dt>
                      <dd className="text-foreground text-right">{s.program}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Year</dt>
                      <dd className="text-foreground">{yearLabel(s.yearLevel)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Registered</dt>
                      <dd className="text-foreground">{s.registrationDate}</dd>
                    </div>
                  </dl>
                  <Button variant="outline" size="sm" className="gap-1.5 w-full mt-1" onClick={() => setViewStudent(s)}>
                    <Eye className="size-3.5" /> View Details
                  </Button>
                </div>
              ))}
              {paginated.length === 0 && (
                <p className="col-span-full py-8 text-center text-sm text-muted-foreground">No students found.</p>
              )}
            </div>
          )}
          <DataPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Student Details Dialog */}
      <Dialog open={!!viewStudent} onOpenChange={open => { if (!open) setViewStudent(null) }}>
        <DialogContent className="max-w-md">
          {viewStudent && (
            <>
              <DialogHeader>
                <DialogTitle>Student Details</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-foreground">{viewStudent.firstName} {viewStudent.lastName}</p>
                  <Badge variant={statusVariant[viewStudent.status]} className="capitalize">{viewStudent.status}</Badge>
                </div>
                <Separator />
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground uppercase tracking-wide">Student ID</dt>
                    <dd className="font-mono font-medium text-foreground mt-0.5">{viewStudent.studentId}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground uppercase tracking-wide">Registered</dt>
                    <dd className="text-foreground mt-0.5">{viewStudent.registrationDate}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs text-muted-foreground uppercase tracking-wide">Email</dt>
                    <dd className="text-foreground mt-0.5">{viewStudent.email}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs text-muted-foreground uppercase tracking-wide">Program</dt>
                    <dd className="text-foreground mt-0.5">{viewStudent.program}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground uppercase tracking-wide">Year</dt>
                    <dd className="text-foreground mt-0.5">{yearLabel(viewStudent.yearLevel)}</dd>
                  </div>
                </dl>
                {viewStudent.status === "pending" && (
                  <>
                    <Separator />
                    <div className="flex gap-2">
                      <Button className="flex-1 gap-1.5 bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(viewStudent.id)}>
                        <CheckCircle className="size-4" /> Accept
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="flex-1 gap-1.5">
                            <XCircle className="size-4" /> Reject
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject Registration</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reject the registration for {viewStudent.firstName} {viewStudent.lastName} ({viewStudent.studentId})?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleReject(viewStudent.id)}>Reject</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}