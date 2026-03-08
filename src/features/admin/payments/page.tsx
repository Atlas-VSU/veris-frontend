"use client"

import { useState, useMemo, useRef } from "react"
import {
  CheckCircle, XCircle, Clock, Eye, MinusCircle,
  PenLine, Users,
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { PageHeader } from "@/components/shared/PageHeader"
import { SearchInput } from "@/components/shared/SearchInput"
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
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Separator } from "@/src/components/ui/separator"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { payments as initialPayments, unpaidStudentRecords as initialUnpaid } from "./mock-data"
import type { Payment, PaymentStatus, PaymentLineItem, StudentUnpaidRecord } from "./types"
import { toast } from "sonner"
import { StatCard } from "@/components/shared/StatCard"
import { DataPagination } from "@/components/shared/DataPagination"
import { ViewToggle } from "@/components/shared/ViewToggle"
import type { ViewMode } from "@/components/shared/ViewToggle"
import { PaymentReviewDialog } from "@/components/shared/PaymentReviewDialog"
import PaymentReceiptDialog from "./components/PaymentReceiptDialog"
import type { ReceiptData } from "./components/PaymentReceiptDialog"

const ITEMS_PER_PAGE = 10

// ─── Status badge config (consistent with fees/fines pages) ────────────────

const statusConfig: Record<PaymentStatus, {
  label: string
  variant: "default" | "secondary" | "destructive"
  icon: typeof Clock
}> = {
  pending:  { label: "Pending",  variant: "default",     icon: Clock       },
  approved: { label: "Approved", variant: "secondary",   icon: CheckCircle },
  declined: { label: "Declined", variant: "destructive", icon: XCircle     },
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function derivePaymentTypeLabel(payment: Payment): string {
  if (!payment.lineItems?.length) {
    const labels: Record<string, string> = { "membership-fee": "Fee", fine: "Fine", bulk: "Bulk Payment" }
    return labels[payment.type] ?? payment.type
  }
  const hasFine = payment.lineItems.some(i => i.type === "fine")
  const hasFee = payment.lineItems.some(i => i.type === "fee")
  if (hasFine && hasFee) return "Bulk Payment"
  if (hasFine) return "Fine"
  return "Fee"
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function PaymentsPage() {
  // ── Tab ──
  const [dataView, setDataView] = useState<"submissions" | "unpaid">("submissions")

  // ── Submissions state ──
  const [paymentsList, setPaymentsList] = useState<Payment[]>(initialPayments)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("table")

  // ── Unpaid state ──
  const [unpaidRecords, setUnpaidRecords] = useState<StudentUnpaidRecord[]>(initialUnpaid)
  const [unpaidSearch, setUnpaidSearch] = useState("")
  const [unpaidPage, setUnpaidPage] = useState(1)
  const [unpaidViewMode, setUnpaidViewMode] = useState<ViewMode>("table")

  // ── Unpaid detail modal ──
  const [selectedUnpaid, setSelectedUnpaid] = useState<StudentUnpaidRecord | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [checkedDues, setCheckedDues] = useState<Set<string>>(new Set())
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10))

  // ── Receipt ──
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)

  // Counter for generating unique IDs (avoids Date.now() during render)
  const idCounter = useRef(0)

  // ── Submissions filtering ──
  const filtered = paymentsList.filter(p => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(search.toLowerCase()) ||
      p.referenceCode.toLowerCase().includes(search.toLowerCase()) ||
      p.studentId.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === "all" || p.status === filterStatus
    return matchesSearch && matchesStatus
  })
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  // ── Unpaid filtering ──
  const filteredUnpaid = unpaidRecords.filter(r =>
    r.studentName.toLowerCase().includes(unpaidSearch.toLowerCase()) ||
    r.studentId.toLowerCase().includes(unpaidSearch.toLowerCase()),
  )
  const unpaidTotalPages = Math.ceil(filteredUnpaid.length / ITEMS_PER_PAGE)
  const paginatedUnpaid = filteredUnpaid.slice((unpaidPage - 1) * ITEMS_PER_PAGE, unpaidPage * ITEMS_PER_PAGE)

  // ── Stats ──
  const totalPending = paymentsList.filter(p => p.status === "pending").length
  const totalApproved = paymentsList.filter(p => p.status === "approved").length
  const totalDeclined = paymentsList.filter(p => p.status === "declined").length
  const totalUnpaidStudents = unpaidRecords.length

  // ── Live-derived unpaid record from state ──
  const liveSelectedUnpaid = useMemo(
    () => unpaidRecords.find(r => r.studentId === selectedUnpaid?.studentId) ?? null,
    [unpaidRecords, selectedUnpaid],
  )

  const selectedDues = useMemo(() => {
    if (!liveSelectedUnpaid) return []
    return liveSelectedUnpaid.dues.filter(d => checkedDues.has(d.id))
  }, [liveSelectedUnpaid, checkedDues])

  const selectedTotal = selectedDues.reduce((s, d) => s + d.amount, 0)

  // ── Handlers ──

  function handleApprove(id: string) {
    setPaymentsList(prev =>
      prev.map(p => p.id === id ? {
        ...p,
        status: "approved" as PaymentStatus,
        reviewedDate: new Date().toISOString().split("T")[0],
        reviewedBy: "Admin",
      } : p),
    )
    toast.success("Payment approved successfully")
    setSelectedPayment(null)
  }

  function handleDecline(id: string, reason: string) {
    setPaymentsList(prev =>
      prev.map(p => p.id === id ? {
        ...p,
        status: "declined" as PaymentStatus,
        reviewedDate: new Date().toISOString().split("T")[0],
        reviewedBy: "Admin",
        remarks: reason,
      } : p),
    )
    toast.success("Payment declined with remarks")
    setSelectedPayment(null)
  }

  function openReview(payment: Payment) {
    setSelectedPayment(payment)
    setReviewOpen(true)
  }

  function openUnpaidDetail(record: StudentUnpaidRecord) {
    setSelectedUnpaid(record)
    setCheckedDues(new Set())
    setPaymentDate(new Date().toISOString().slice(0, 10))
    setDetailOpen(true)
  }

  function toggleDue(dueId: string) {
    setCheckedDues(prev => {
      const next = new Set(prev)
      if (next.has(dueId)) next.delete(dueId)
      else next.add(dueId)
      return next
    })
  }

  function toggleAllDues() {
    if (!liveSelectedUnpaid) return
    const allIds = liveSelectedUnpaid.dues.map(d => d.id)
    const allChecked = allIds.every(id => checkedDues.has(id))
    setCheckedDues(allChecked ? new Set() : new Set(allIds))
  }

  function handleLogPayment() {
    if (!liveSelectedUnpaid || selectedDues.length === 0) return

    idCounter.current += 1
    const seq = idCounter.current
    const receiptId = `REC-${seq}-${paymentDate}`
    const lineItems: PaymentLineItem[] = selectedDues.map(d => ({
      type: d.type,
      referenceId: d.referenceId,
      name: d.name,
      amount: d.amount,
    }))

    const newPayment: Payment = {
      id: `pay-manual-${seq}`,
      studentId: liveSelectedUnpaid.studentId,
      studentName: liveSelectedUnpaid.studentName,
      type: "bulk",
      amount: selectedTotal,
      referenceCode: receiptId,
      receiptImage: "",
      status: "approved",
      submittedDate: paymentDate,
      reviewedDate: paymentDate,
      reviewedBy: "Admin",
      lineItems,
    }

    setPaymentsList(prev => [newPayment, ...prev])

    // Remove settled dues from unpaid record
    const settledIds = new Set(selectedDues.map(d => d.id))
    const remainingDues = liveSelectedUnpaid.dues.filter(d => !settledIds.has(d.id))
    if (remainingDues.length === 0) {
      setUnpaidRecords(prev => prev.filter(r => r.studentId !== liveSelectedUnpaid.studentId))
    } else {
      setUnpaidRecords(prev =>
        prev.map(r =>
          r.studentId === liveSelectedUnpaid.studentId ? { ...r, dues: remainingDues } : r,
        ),
      )
    }

    setReceiptData({
      receiptId,
      studentName: liveSelectedUnpaid.studentName,
      studentId: liveSelectedUnpaid.studentId,
      items: selectedDues.map(d => ({ name: d.name, type: d.type, amount: d.amount })),
      total: selectedTotal,
      date: paymentDate,
    })
    setDetailOpen(false)
    setReceiptOpen(true)
    toast.success("Payment logged successfully")
  }

  // ── Render ──

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        variant="admin"
        title="Payment Submissions"
        context="2nd Semester · A.Y. 2025–2026"
        description="Review and manage student payment submissions"
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard title="Pending Review" value={totalPending.toString()} description="Awaiting approval" icon={Clock} />
        <StatCard title="Approved" value={totalApproved.toString()} description="Successfully approved" icon={CheckCircle} />
        <StatCard title="Declined" value={totalDeclined.toString()} description="Rejected submissions" icon={XCircle} />
        <StatCard title="Unpaid Students" value={totalUnpaidStudents.toString()} description="With unsettled dues" icon={Users} />
      </div>

      {/* Main Card */}
      <Card className="border-border bg-card">
        <div className="px-6 pt-6">
          <Tabs
            value={dataView}
            onValueChange={v => {
              setDataView(v as "submissions" | "unpaid")
              setCurrentPage(1)
              setUnpaidPage(1)
              setFilterStatus("all")
            }}
          >
            <TabsList className="w-full flex-1">
              <TabsTrigger value="submissions">Payment Submissions</TabsTrigger>
              <TabsTrigger value="unpaid">Log Payments Manually</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {dataView === "submissions" ? (
          // Submission view
          <>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">All Payment Submissions</CardTitle>
                  <CardDescription className="text-muted-foreground">{filtered.length} records found</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <SearchInput
                    placeholder="Search student or reference..."
                    value={search}
                    onChange={v => { setSearch(v); setCurrentPage(1) }}
                    className="w-full sm:w-64"
                  />
                  <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setCurrentPage(1) }}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                  <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === "card" ? (
                <>
                  {filtered.length === 0 ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">No payment submissions found</p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {paginated.map(payment => {
                        const cfg = statusConfig[payment.status]
                        const StatusIcon = cfg.icon
                        return (
                          <Card key={payment.id} className="border-border bg-card flex flex-col">
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <CardTitle className="text-sm font-semibold">{payment.studentName}</CardTitle>
                                  <CardDescription className="text-xs">{payment.studentId}</CardDescription>
                                </div>
                                <Badge variant={cfg.variant} className="flex items-center gap-1 text-xs shrink-0">
                                  <StatusIcon className="size-3" />{cfg.label}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2 pt-0 flex-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{derivePaymentTypeLabel(payment)}</span>
                                <span className="font-semibold">₱{payment.amount.toLocaleString()}</span>
                              </div>
                              <div className="text-xs text-muted-foreground font-mono">{payment.referenceCode}</div>
                              <div className="text-xs text-muted-foreground">{new Date(payment.submittedDate).toLocaleDateString()}</div>
                              <div className="mt-auto pt-2">
                                <Button size="sm" variant="outline" className="w-full gap-1.5" onClick={() => openReview(payment)}>
                                  <Eye className="size-3.5" /> View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                  <DataPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filtered.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                  />
                </>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-border">
                          <TableHead>Student</TableHead>
                          <TableHead className="hidden sm:table-cell">Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead className="hidden md:table-cell">Reference Code</TableHead>
                          <TableHead className="hidden sm:table-cell">Submitted</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                              No payment submissions found
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginated.map(payment => {
                            const cfg = statusConfig[payment.status]
                            const StatusIcon = cfg.icon
                            return (
                              <TableRow key={payment.id} className="border-border">
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-foreground">{payment.studentName}</span>
                                    <span className="text-xs text-muted-foreground">{payment.studentId}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-foreground hidden sm:table-cell">{derivePaymentTypeLabel(payment)}</TableCell>
                                <TableCell className="text-sm font-medium text-foreground">₱{payment.amount.toLocaleString()}</TableCell>
                                <TableCell className="text-sm font-mono text-foreground hidden md:table-cell">{payment.referenceCode}</TableCell>
                                <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{new Date(payment.submittedDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <Badge variant={cfg.variant} className="flex items-center gap-1 w-fit text-xs">
                                    <StatusIcon className="size-3" />{cfg.label}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => openReview(payment)}>
                                    <Eye className="size-3.5" /> View Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <DataPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filtered.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </CardContent>
          </>
        ) : (
          /* ═══════════════════════════════════════════════════════════════
             UNPAID DUES TAB
             ═══════════════════════════════════════════════════════════ */
          <>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">Students with Unpaid Dues</CardTitle>
                  <CardDescription className="text-muted-foreground">{filteredUnpaid.length} student(s) found</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <SearchInput
                    placeholder="Search by name or ID..."
                    value={unpaidSearch}
                    onChange={v => { setUnpaidSearch(v); setUnpaidPage(1) }}
                    className="w-full sm:w-64"
                  />
                  <ViewToggle viewMode={unpaidViewMode} onViewChange={setUnpaidViewMode} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {unpaidViewMode === "card" ? (
                <>
                  {filteredUnpaid.length === 0 ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">No unpaid records found</p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {paginatedUnpaid.map(record => {
                        const totalDue = record.dues.reduce((s, d) => s + d.amount, 0)
                        return (
                          <Card key={record.studentId} className="border-border bg-card">
                            <CardContent className="flex flex-col gap-3 p-4">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-foreground">{record.studentName}</p>
                                  <p className="text-xs text-muted-foreground">{record.studentId}</p>
                                </div>
                                <Badge variant="outline" className="flex items-center gap-1 text-xs shrink-0">
                                  <MinusCircle className="size-3" />Unpaid
                                </Badge>
                              </div>
                              <Separator />
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <p className="text-muted-foreground"># Dues</p>
                                  <p className="font-medium">{record.dues.length}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Total Outstanding</p>
                                  <p className="font-medium">₱{totalDue.toLocaleString()}</p>
                                </div>
                              </div>
                              <Button
                                size="sm" variant="outline"
                                className="w-full gap-1.5 text-xs"
                                onClick={() => openUnpaidDetail(record)}
                              >
                                <Eye className="size-3.5" /> View Details
                              </Button>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                  <DataPagination
                    currentPage={unpaidPage}
                    totalPages={unpaidTotalPages}
                    totalItems={filteredUnpaid.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setUnpaidPage}
                  />
                </>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-border">
                          <TableHead>Student</TableHead>
                          <TableHead className="text-center"># Dues</TableHead>
                          <TableHead className="text-right">Total Outstanding</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUnpaid.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                              No unpaid records found
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedUnpaid.map(record => {
                            const totalDue = record.dues.reduce((s, d) => s + d.amount, 0)
                            return (
                              <TableRow key={record.studentId} className="border-border">
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-foreground">{record.studentName}</span>
                                    <span className="text-xs text-muted-foreground">{record.studentId}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center text-sm">{record.dues.length}</TableCell>
                                <TableCell className="text-right text-sm font-medium">₱{totalDue.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    size="sm" variant="outline"
                                    className="gap-1.5 text-xs"
                                    onClick={() => openUnpaidDetail(record)}
                                  >
                                    <Eye className="size-3.5" /> View Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <DataPagination
                    currentPage={unpaidPage}
                    totalPages={unpaidTotalPages}
                    totalItems={filteredUnpaid.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setUnpaidPage}
                  />
                </>
              )}
            </CardContent>
          </>
        )}
      </Card>

      {/* ── Review Dialog (submissions) ─────────────────────────────── */}
      <PaymentReviewDialog
        open={reviewOpen}
        onOpenChange={open => { setReviewOpen(open); if (!open) setSelectedPayment(null) }}
        data={selectedPayment ? {
          studentName: selectedPayment.studentName,
          studentId: selectedPayment.studentId,
          typeLabel: derivePaymentTypeLabel(selectedPayment),
          lineItems: selectedPayment.lineItems?.map(i => ({
            label: i.name,
            sublabel: i.type,
            amount: i.amount,
          })),
          showLineItemsTotal: !!(selectedPayment.lineItems?.length),
          amountPaid: selectedPayment.amount,
          referenceNo: selectedPayment.referenceCode,
          submittedAt: new Date(selectedPayment.submittedDate).toLocaleDateString(),
          receiptContent: selectedPayment.receiptImage,
          declineRemarks: selectedPayment.remarks,
          reviewedBy: selectedPayment.reviewedBy,
          reviewedAt: selectedPayment.reviewedDate
            ? new Date(selectedPayment.reviewedDate).toLocaleDateString()
            : undefined,
        } : null}
        onApprove={selectedPayment?.status === "pending" ? () => handleApprove(selectedPayment!.id) : undefined}
        onReject={selectedPayment?.status === "pending" ? reason => handleDecline(selectedPayment!.id, reason) : undefined}
      />

      {/* ── Unpaid Detail / Log Payment Dialog ─────────────────────── */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Unsettled Dues — {liveSelectedUnpaid?.studentName}</DialogTitle>
            <DialogDescription>
              {liveSelectedUnpaid?.studentId} · {liveSelectedUnpaid?.program} · Year {liveSelectedUnpaid?.yearLevel}
            </DialogDescription>
          </DialogHeader>

          {liveSelectedUnpaid && (
            <div className="flex flex-col gap-4">
              {/* Student info summary */}
              <div className="rounded-md border border-border bg-muted/30 px-4 py-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Student Name</p>
                    <p className="text-sm font-medium text-foreground">{liveSelectedUnpaid.studentName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Student ID</p>
                    <p className="text-sm font-medium text-foreground">{liveSelectedUnpaid.studentId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Program</p>
                    <p className="text-sm font-medium text-foreground">{liveSelectedUnpaid.program}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Year Level</p>
                    <p className="text-sm font-medium text-foreground">{liveSelectedUnpaid.yearLevel}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payables with checkboxes */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground">Payable Items</p>
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={toggleAllDues}
                  >
                    {liveSelectedUnpaid.dues.every(d => checkedDues.has(d.id)) ? "Deselect All" : "Select All"}
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  {liveSelectedUnpaid.dues.map(due => (
                    <label
                      key={due.id}
                      className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors has-[button[data-state=checked]]:border-primary/40 has-[button[data-state=checked]]:bg-primary/5"
                    >
                      <Checkbox
                        checked={checkedDues.has(due.id)}
                        onCheckedChange={() => toggleDue(due.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-snug">{due.name}</p>
                        <Badge variant="outline" className="mt-1 text-[10px] capitalize">{due.type}</Badge>
                      </div>
                      <span className="text-sm font-semibold text-foreground shrink-0">₱{due.amount.toLocaleString()}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Selected total */}
              {selectedDues.length > 0 && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      Selected ({selectedDues.length} item{selectedDues.length !== 1 ? "s" : ""})
                    </span>
                    <span className="text-base font-bold text-foreground">₱{selectedTotal.toLocaleString()}</span>
                  </div>
                </>
              )}

              {/* Payment date */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="paymentDate">Date of Payment <span className="text-destructive">*</span></Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={paymentDate}
                  onChange={e => setPaymentDate(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Cancel</Button>
            <Button
              disabled={selectedDues.length === 0}
              className="gap-1.5 border-[#1B5E20]/40 bg-[#1B5E20] text-white hover:bg-[#2E7D32] dark:bg-green-700 dark:hover:bg-green-600"
              onClick={handleLogPayment}
            >
              <PenLine className="size-3.5" />
              Log Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Receipt Dialog ─────────────────────────────────────────── */}
      <PaymentReceiptDialog
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        data={receiptData}
      />
    </div>
  )
}
