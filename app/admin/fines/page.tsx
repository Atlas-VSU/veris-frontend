"use client"

import { useState, useMemo } from "react"
import {
  AlertTriangle, Search, Eye, CheckCircle, XCircle,
  LayoutGrid, List, ChevronRight, Banknote, Users, CircleDollarSign,
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/src/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/src/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/src/components/ui/select"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Separator } from "@/src/components/ui/separator"
import { studentFineRecords as initialRecords } from "./mock-data"
import type { StudentFineRecord, FineItem, StudentFineStatus } from "./types"
import { toast } from "sonner"
import { StatCard } from "@/components/stat-card"
import { cn } from "@/src/lib/utils"

// ─── Helpers ───────────────────────────────────────────────────────────────
// All helpers operate at the StudentFineRecord level because payment is
// submitted in bulk once per student at the end of the semester.

function computeStudentStatus(record: StudentFineRecord): StudentFineStatus {
  const nonWaived = record.fineItems.filter(i => !i.isWaived)
  if (nonWaived.length === 0) return "paid"                          // all waived
  const bps = record.bulkPaymentSubmission
  if (bps?.status === "approved") return "paid"
  if (bps?.status === "pending")  return "partial"                   // under review
  return "pending"
}

function computeAmountPaid(record: StudentFineRecord): number {
  if (record.bulkPaymentSubmission?.status !== "approved") return 0
  return record.fineItems.filter(i => !i.isWaived).reduce((s, i) => s + i.amount, 0)
}

function computeBalance(record: StudentFineRecord): number {
  if (record.bulkPaymentSubmission?.status === "approved") return 0
  return record.fineItems.filter(i => !i.isWaived).reduce((s, i) => s + i.amount, 0)
}

function computeTotal(items: FineItem[]): number {
  return items.filter(i => !i.isWaived).reduce((s, i) => s + i.amount, 0)
}

// ─── Config ────────────────────────────────────────────────────────────────

const studentStatusConfig: Record<StudentFineStatus, {
  label: string
  variant: "default" | "secondary" | "destructive" | "outline"
}> = {
  pending: { label: "Pending", variant: "destructive" },
  partial: { label: "Partial", variant: "default" },
  paid:    { label: "Paid",    variant: "secondary"  },
}

const paymentStatusConfig: Record<string, {
  label: string
  variant: "default" | "secondary" | "destructive" | "outline"
}> = {
  pending:  { label: "Pending",  variant: "default"     },
  approved: { label: "Approved", variant: "secondary"   },
  declined: { label: "Declined", variant: "destructive" },
}

const appealStatusConfig: Record<string, {
  label: string
  variant: "default" | "secondary" | "destructive"
}> = {
  pending:  { label: "Pending",  variant: "default"     },
  approved: { label: "Approved", variant: "secondary"   },
  rejected: { label: "Rejected", variant: "destructive" },
}

// ─── DetailRow ──────────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function FinesPage() {
  const [records, setRecords] = useState<StudentFineRecord[]>(initialRecords)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"table" | "card">("table")

  // Drill-down state
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [breakdownOpen, setBreakdownOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [fineDetailOpen, setFineDetailOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  // ─ Derive live focused records from state ─
  const liveSelectedRecord = useMemo(
    () => records.find(r => r.studentId === selectedStudentId) ?? null,
    [records, selectedStudentId],
  )

  const liveSelectedItem = useMemo(() => {
    if (!selectedItemId) return null
    for (const r of records) {
      const found = r.fineItems.find(i => i.id === selectedItemId)
      if (found) return found
    }
    return null
  }, [records, selectedItemId])

  // ─ Summaries ─
  const summaries = useMemo(
    () => records.map(r => ({
      record: r,
      total:      computeTotal(r.fineItems),
      amountPaid: computeAmountPaid(r),
      balance:    computeBalance(r),
      status:     computeStudentStatus(r),
    })),
    [records],
  )

  const filtered = summaries.filter(({ record, status }) => {
    const matchesSearch =
      record.studentName.toLowerCase().includes(search.toLowerCase()) ||
      record.studentId.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === "all" || status === filterStatus
    return matchesSearch && matchesStatus
  })

  // ─ Stats ─
  const totalOutstanding = summaries.reduce((s, r) => s + r.balance, 0)
  const totalCollected   = summaries.reduce((s, r) => s + r.amountPaid, 0)
  const pendingCount     = summaries.filter(r => r.status === "pending").length

  // ─ Handlers ─
  // Bulk payment is approved/declined at the record level — one decision settles all fines.
  function updateRecordPaymentStatus(studentId: string, status: "approved" | "declined", rejectionReason?: string) {
    setRecords(prev => prev.map(r => {
      if (r.studentId !== studentId || !r.bulkPaymentSubmission) return r
      return {
        ...r,
        bulkPaymentSubmission: {
          ...r.bulkPaymentSubmission,
          status,
          ...(rejectionReason ? { rejectionReason } : {}),
        },
      }
    }))
  }

  function handleApprovePayment() {
    if (!selectedStudentId) return
    updateRecordPaymentStatus(selectedStudentId, "approved")
    toast.success("Bulk payment approved — all fines settled")
    setApproveConfirmOpen(false)
    setPaymentOpen(false)
  }

  function handleRejectPayment() {
    if (!rejectReason.trim()) { toast.error("Please provide a reason for rejection"); return }
    if (!selectedStudentId) return
    updateRecordPaymentStatus(selectedStudentId, "declined", rejectReason)
    toast.success("Bulk payment rejected")
    setRejectOpen(false)
    setPaymentOpen(false)
    setRejectReason("")
  }

  function openBreakdown(studentId: string) {
    setSelectedStudentId(studentId)
    setBreakdownOpen(true)
  }

  function openFineDetail(itemId: string) {
    setSelectedItemId(itemId)
    setFineDetailOpen(true)
  }

  // ─ Render ─
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Fines Management</h1>
        <p className="text-sm text-muted-foreground">Review and manage student fines</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard title="Students w/ Fines" value={records.length.toString()} description="Have at least one fine" icon={Users} />
        <StatCard title="Outstanding Balance" value={`₱${totalOutstanding.toLocaleString()}`} description="Total unpaid amount" icon={AlertTriangle} />
        <StatCard title="Total Collected" value={`₱${totalCollected.toLocaleString()}`} description="Total approved payments" icon={Banknote} />
        <StatCard title="Pending" value={pendingCount.toString()} description="Students with unsettled fines" icon={CircleDollarSign} />
      </div>

      {/* Main Card */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base text-foreground">Student Fine Records</CardTitle>
              <CardDescription className="text-muted-foreground">{filtered.length} student(s) found</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or ID..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-64 pl-8"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
              {/* View toggle */}
              <div className="flex rounded-md border border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("size-9 rounded-r-none", viewMode === "table" && "bg-accent")}
                  onClick={() => setViewMode("table")}
                >
                  <List className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("size-9 rounded-l-none border-l border-border", viewMode === "card" && "bg-accent")}
                  onClick={() => setViewMode("card")}
                >
                  <LayoutGrid className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Student</TableHead>
                    <TableHead className="text-center"># Fines</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount Paid</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(({ record, total, amountPaid, balance, status }) => {
                    const cfg = studentStatusConfig[status]
                    return (
                      <TableRow key={record.studentId} className="border-border">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">{record.studentName}</span>
                            <span className="text-xs text-muted-foreground">{record.studentId}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-sm">{record.fineItems.length}</TableCell>
                        <TableCell className="text-right text-sm font-medium">₱{total.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={cfg.variant} className="capitalize">{cfg.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">₱{amountPaid.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm font-medium">₱{balance.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm" variant="ghost"
                            className="gap-1.5 text-xs"
                            onClick={() => openBreakdown(record.studentId)}
                          >
                            <Eye className="size-3.5" /> View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                        No records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(({ record, total, amountPaid, balance, status }) => {
                const cfg = studentStatusConfig[status]
                return (
                  <Card key={record.studentId} className="border-border">
                    <CardContent className="flex flex-col gap-3 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{record.studentName}</p>
                          <p className="text-xs text-muted-foreground">{record.studentId}</p>
                        </div>
                        <Badge variant={cfg.variant} className="capitalize">{cfg.label}</Badge>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground"># Fines</p>
                          <p className="font-medium">{record.fineItems.length}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Amount</p>
                          <p className="font-medium">₱{total.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Amount Paid</p>
                          <p className="font-medium">₱{amountPaid.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Balance</p>
                          <p className="font-medium">₱{balance.toLocaleString()}</p>
                        </div>
                      </div>
                      <Button
                        size="sm" variant="outline"
                        className="mt-1 w-full gap-1.5 text-xs"
                        onClick={() => openBreakdown(record.studentId)}
                      >
                        <Eye className="size-3.5" /> View Details
                        <ChevronRight className="ml-auto size-3.5" />
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
              {filtered.length === 0 && (
                <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                  No records found.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Dialog 1: Student Fine Breakdown ───────────────────────────── */}
      <Dialog open={breakdownOpen} onOpenChange={setBreakdownOpen}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Fine Breakdown — {liveSelectedRecord?.studentName}</DialogTitle>
            <DialogDescription>
              {liveSelectedRecord?.studentId} · {liveSelectedRecord?.fineItems.length} fine item(s)
            </DialogDescription>
          </DialogHeader>

          {/* Bulk payment submission banner */}
          {liveSelectedRecord?.bulkPaymentSubmission && (
            <div className="flex flex-col gap-2 rounded-md border border-border bg-muted/30 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">End-of-Semester Bulk Payment</span>
                  <Badge variant={paymentStatusConfig[liveSelectedRecord.bulkPaymentSubmission.status].variant}>
                    {paymentStatusConfig[liveSelectedRecord.bulkPaymentSubmission.status].label}
                  </Badge>
                </div>
                {liveSelectedRecord.bulkPaymentSubmission.status === "pending" && (
                  <Button size="sm" variant="outline" onClick={() => setPaymentOpen(true)}>
                    Review Payment
                  </Button>
                )}
              </div>
              {liveSelectedRecord.bulkPaymentSubmission.status === "declined" && liveSelectedRecord.bulkPaymentSubmission.rejectionReason && (
                <p className="text-xs text-destructive">
                  Rejection reason: {liveSelectedRecord.bulkPaymentSubmission.rejectionReason}
                </p>
              )}
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Type Code</TableHead>
                  <TableHead>Type Name</TableHead>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Event Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liveSelectedRecord?.fineItems.map(item => (
                  <TableRow key={item.id} className="border-border">
                    <TableCell className="text-muted-foreground">{item.itemNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">{item.fineTypeCode}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className="flex items-center gap-1.5">
                        {item.fineTypeName}
                        {item.isWaived && (
                          <Badge variant="outline" className="py-0 text-xs">Waived</Badge>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.eventName ?? "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.eventDate ?? "—"}</TableCell>
                    <TableCell className="text-right text-sm font-medium">₱{item.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm" variant="ghost"
                        className="gap-1.5 text-xs"
                        onClick={() => openFineDetail(item.id)}
                      >
                        <Eye className="size-3.5" /> View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Dialog 2: Fine Item Details ────────────────────────────────── */}
      <Dialog open={fineDetailOpen} onOpenChange={setFineDetailOpen}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Fine Item Details — #{liveSelectedItem?.itemNumber}</DialogTitle>
            <DialogDescription>Complete details of this fine item.</DialogDescription>
          </DialogHeader>
          {liveSelectedItem && (
            <div className="flex flex-col gap-4">
              <Separator />

              {/* Core fine details */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <DetailRow label="Item Number"    value={`#${liveSelectedItem.itemNumber}`} />
                <DetailRow label="Fine Type Code" value={liveSelectedItem.fineTypeCode} />
                <DetailRow label="Fine Type Name" value={
                  <span className="flex items-center gap-2">
                    {liveSelectedItem.fineTypeName}
                    {liveSelectedItem.isWaived && (
                      <Badge variant="outline" className="py-0 text-xs">Waived</Badge>
                    )}
                  </span>
                } />
                {liveSelectedItem.eventName && <DetailRow label="Event Name" value={liveSelectedItem.eventName} />}
                {liveSelectedItem.eventDate && <DetailRow label="Event Date" value={liveSelectedItem.eventDate} />}
                <DetailRow label="Amount"         value={`₱${liveSelectedItem.amount.toLocaleString()}`} />
                <DetailRow label="Reason"         value={liveSelectedItem.reason} />
                {liveSelectedItem.timeViolation && (
                  <DetailRow label="Time Violation" value={liveSelectedItem.timeViolation} />
                )}
                <DetailRow label="Issued By" value={liveSelectedItem.issuedBy} />
                <DetailRow label="Issued At" value={liveSelectedItem.issuedAt} />
              </div>

              {/* Waiver details */}
              {liveSelectedItem.isWaived && (liveSelectedItem.waivedBy || liveSelectedItem.waivedAt || liveSelectedItem.waivedReason) && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Waiver Details
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      {liveSelectedItem.waivedBy     && <DetailRow label="Waived By"     value={liveSelectedItem.waivedBy} />}
                      {liveSelectedItem.waivedAt     && <DetailRow label="Waived At"     value={liveSelectedItem.waivedAt} />}
                      {liveSelectedItem.waivedReason && <DetailRow label="Waived Reason" value={liveSelectedItem.waivedReason} />}
                    </div>
                  </div>
                </>
              )}

              {/* Appeal details */}
              {liveSelectedItem.appeal && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Appeal Details
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      <DetailRow label="Appeal Notes" value={liveSelectedItem.appeal.notes} />
                      <DetailRow label="Appealed At"  value={liveSelectedItem.appeal.appealedAt} />
                      <DetailRow label="Appeal Status" value={
                        <Badge variant={appealStatusConfig[liveSelectedItem.appeal.status].variant} className="text-xs">
                          {appealStatusConfig[liveSelectedItem.appeal.status].label}
                        </Badge>
                      } />
                      {liveSelectedItem.appeal.resolvedBy && <DetailRow label="Resolved By" value={liveSelectedItem.appeal.resolvedBy} />}
                      {liveSelectedItem.appeal.resolvedAt && <DetailRow label="Resolved At" value={liveSelectedItem.appeal.resolvedAt} />}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Dialog 3: Bulk Payment Submission Review ─────────────────── */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Bulk Payment Submission</DialogTitle>
            <DialogDescription>
              One payment covers all outstanding fines for {liveSelectedRecord?.studentName}.
              Review the details before approving or rejecting.
            </DialogDescription>
          </DialogHeader>
          {liveSelectedRecord?.bulkPaymentSubmission && (
            <div className="flex flex-col gap-4">
              {/* Fine items covered */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fine Items Covered</p>
                <div className="divide-y divide-border rounded-md border border-border">
                  {liveSelectedRecord.fineItems.filter(i => !i.isWaived).map(i => (
                    <div key={i.id} className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm">
                        {i.fineTypeName}{i.eventName ? ` — ${i.eventName}` : ""}
                      </span>
                      <span className="text-sm font-medium">₱{i.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between bg-muted/40 px-3 py-2">
                    <span className="text-sm font-semibold">Total</span>
                    <span className="text-sm font-semibold">₱{computeTotal(liveSelectedRecord.fineItems).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Receipt placeholder */}
              <div className="flex h-36 items-center justify-center rounded-md border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
                Receipt Image Preview
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <DetailRow label="Amount Paid"    value={`₱${liveSelectedRecord.bulkPaymentSubmission.amountPaid.toLocaleString()}`} />
                <DetailRow label="Payment Method" value={liveSelectedRecord.bulkPaymentSubmission.paymentMethod} />
                {liveSelectedRecord.bulkPaymentSubmission.gcashReferenceNumber && (
                  <DetailRow label="GCash Ref #" value={liveSelectedRecord.bulkPaymentSubmission.gcashReferenceNumber} />
                )}
                <DetailRow label="Date of Payment" value={liveSelectedRecord.bulkPaymentSubmission.dateOfPayment} />
              </div>
              <DialogFooter className="flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  className="gap-1.5 text-destructive hover:text-destructive"
                  onClick={() => setRejectOpen(true)}
                >
                  <XCircle className="size-4" /> Reject
                </Button>
                <Button className="gap-1.5" onClick={() => setApproveConfirmOpen(true)}>
                  <CheckCircle className="size-4" /> Approve
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Dialog 4: Approve Confirmation ────────────────────────────── */}
      <Dialog open={approveConfirmOpen} onOpenChange={setApproveConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Approval</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this bulk payment? This will mark all fine items for {liveSelectedRecord?.studentName} as settled.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleApprovePayment}>Yes, Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog 5: Reject with Reason ──────────────────────────────── */}
      <Dialog
        open={rejectOpen}
        onOpenChange={v => { setRejectOpen(v); if (!v) setRejectReason("") }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this payment submission.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="rejectReason">Reason for Rejection</Label>
            <Textarea
              id="rejectReason"
              placeholder="e.g. Receipt image is unclear. Please resubmit."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectOpen(false); setRejectReason("") }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectPayment}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
