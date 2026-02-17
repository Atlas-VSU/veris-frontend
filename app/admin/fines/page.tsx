"use client"

import { useState } from "react"
import { AlertTriangle, Plus, Search, Download } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/src/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/src/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/src/components/ui/select"
import { Label } from "@/src/components/ui/label"
import { fines as initialFines } from "./mock-data"
import { students } from "../students/mock-data"
import type { Fine, FineStatus } from "./types"
import { toast } from "sonner"
import { StatCard } from "@/components/stat-card"
import { Banknote, CircleDollarSign } from "lucide-react"

const statusVariant: Record<FineStatus, "destructive" | "secondary" | "outline"> = {
  unpaid: "destructive",
  paid: "secondary",
  waived: "outline",
}

export default function FinesPage() {
  const [finesList, setFinesList] = useState<Fine[]>(initialFines)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [addOpen, setAddOpen] = useState(false)

  const filtered = finesList.filter(f => {
    const matchesSearch = f.studentName.toLowerCase().includes(search.toLowerCase()) ||
      f.reason.toLowerCase().includes(search.toLowerCase()) ||
      f.studentId.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === "all" || f.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalUnpaid = finesList.filter(f => f.status === "unpaid").reduce((s, f) => s + f.amount, 0)
  const totalPaid = finesList.filter(f => f.status === "paid").reduce((s, f) => s + f.amount, 0)
  const totalWaived = finesList.filter(f => f.status === "waived").reduce((s, f) => s + f.amount, 0)

  function handleMarkPaid(id: string) {
    setFinesList(prev =>
      prev.map(f => f.id === id ? { ...f, status: "paid" as FineStatus, datePaid: new Date().toISOString().split("T")[0] } : f)
    )
    toast.success("Fine marked as paid")
  }

  function handleWaive(id: string) {
    setFinesList(prev =>
      prev.map(f => f.id === id ? { ...f, status: "waived" as FineStatus } : f)
    )
    toast.success("Fine waived")
  }

  function handleAddFine(formData: FormData) {
    const studentId = formData.get("studentId") as string
    const reason = formData.get("reason") as string
    const amount = Number(formData.get("amount"))
    const student = students.find(s => s.studentId === studentId)
    if (!student) { toast.error("Student not found"); return }
    const newFine: Fine = {
      id: `fn${crypto.randomUUID().slice(0, 8)}`,
      studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      reason,
      amount,
      status: "unpaid",
      dateIssued: new Date().toISOString().split("T")[0],
    }
    setFinesList(prev => [newFine, ...prev])
    setAddOpen(false)
    toast.success("Fine added successfully")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Fines Management</h1>
        <p className="text-sm text-muted-foreground">Track, issue, and manage student fines</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Unpaid" value={`P${totalUnpaid.toLocaleString()}`} description={`${finesList.filter(f => f.status === "unpaid").length} fines`} icon={AlertTriangle} />
        <StatCard title="Total Collected" value={`P${totalPaid.toLocaleString()}`} description={`${finesList.filter(f => f.status === "paid").length} fines`} icon={Banknote} />
        <StatCard title="Total Waived" value={`P${totalWaived.toLocaleString()}`} description={`${finesList.filter(f => f.status === "waived").length} fines`} icon={CircleDollarSign} />
      </div>

      {/* Table Card */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base text-foreground">All Fines</CardTitle>
              <CardDescription className="text-muted-foreground">{filtered.length} records found</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input placeholder="Search student or reason..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 w-64" />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="waived">Waived</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5">
                    <Plus className="size-4" /> Add Fine
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Issue New Fine</DialogTitle>
                    <DialogDescription>Add a new fine to a student record.</DialogDescription>
                  </DialogHeader>
                  <form action={handleAddFine} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Select name="studentId">
                        <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                        <SelectContent>
                          {students.filter(s => s.status === "approved").map(s => (
                            <SelectItem key={s.studentId} value={s.studentId}>{s.studentId} - {s.firstName} {s.lastName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="reason">Reason</Label>
                      <Input name="reason" id="reason" placeholder="e.g. Absent - General Assembly" required />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="amount">Amount (PHP)</Label>
                      <Input name="amount" id="amount" type="number" placeholder="50" required />
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                      <Button type="submit">Issue Fine</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
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
                  <TableHead>Student</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Issued</TableHead>
                  <TableHead>Date Paid</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(fine => (
                  <TableRow key={fine.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{fine.studentName}</span>
                        <span className="text-xs text-muted-foreground">{fine.studentId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] text-sm text-foreground">{fine.reason}</TableCell>
                    <TableCell className="text-right text-sm font-medium text-foreground">P{fine.amount}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[fine.status]} className="capitalize">{fine.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{fine.dateIssued}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{fine.datePaid || "--"}</TableCell>
                    <TableCell className="text-right">
                      {fine.status === "unpaid" && (
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleMarkPaid(fine.id)}>Mark Paid</Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => handleWaive(fine.id)}>Waive</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No fines found.</TableCell>
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
