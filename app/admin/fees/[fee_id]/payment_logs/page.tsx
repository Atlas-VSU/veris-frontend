"use client"

import { use, useState } from "react"
import { ArrowLeft, CheckCircle, Clock, Eye, LayoutGrid, List, Search, XCircle, MinusCircle } from "lucide-react"
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
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { fees, paymentLogs as initialPaymentLogs } from "../../mock-data"
import { students } from "@/app/admin/students/mock-data"
import type { PaymentLog, PaymentLogStatus } from "../../types"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { StatCard } from "@/components/stat-card"
import Image from "next/image"

type RowStatus = PaymentLogStatus | "unpaid"

type AllStudentRow = {
  studentId: string
  studentName: string
  status: RowStatus
  log?: PaymentLog
}

const statusConfig: Record<
  RowStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock }
> = {
  pending_verification: { label: "Pending Verification", variant: "default",     icon: Clock         },
  verified:             { label: "Verified",             variant: "secondary",   icon: CheckCircle   },
  rejected:             { label: "Rejected",             variant: "destructive", icon: XCircle       },
  unpaid:               { label: "Unpaid",               variant: "outline",     icon: MinusCircle   },
}

const paymentMethodLabels: Record<string, string> = {
  gcash:           "GCash",
  cash:            "Cash",
  "bank-transfer": "Bank Transfer",
}

export default function PaymentLogsPage({
  params,
}: {
  params: Promise<{ fee_id: string }>
}) {
  const { fee_id } = use(params)
  const router = useRouter()

  const fee = fees.find(f => f.id === fee_id)
  const [logs, setLogs] = useState<PaymentLog[]>(
    initialPaymentLogs.filter(l => l.feeId === fee_id)
  )
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"card" | "table">("table")
  const [dataView, setDataView] = useState<"submissions" | "all-students">("submissions")

  const [selectedLog, setSelectedLog] = useState<PaymentLog | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  if (!fee) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Fee not found.</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.push("/admin/fees")}>
          <ArrowLeft className="size-4 mr-1" /> Back to Fees
        </Button>
      </div>
    )
  }

  // All-students unified rows: every approved/pending student matched with their log (or unpaid)
  const allStudentRows: AllStudentRow[] = students
    .filter(s => s.status === "approved" || s.status === "pending")
    .map(s => {
      const log = logs.find(l => l.studentId === s.studentId)
      return {
        studentId: s.studentId,
        studentName: `${s.firstName} ${s.lastName}`,
        status: log ? log.status : "unpaid",
        log,
      }
    })

  // Filtered data for each view
  const filteredLogs = logs.filter(l => {
    const matchesSearch =
      l.studentName.toLowerCase().includes(search.toLowerCase()) ||
      l.studentId.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === "all" || l.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const filteredRows = allStudentRows.filter(r => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === "all" || r.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const pendingCount  = logs.filter(l => l.status === "pending_verification").length
  const verifiedCount = logs.filter(l => l.status === "verified").length
  const rejectedCount = logs.filter(l => l.status === "rejected").length
  const unpaidCount   = allStudentRows.filter(r => r.status === "unpaid").length

  function handleApprove(id: string) {
    setLogs(prev =>
      prev.map(l =>
        l.id === id
          ? {
              ...l,
              status: "verified" as PaymentLogStatus,
              verifiedBy: "Admin",
              verifiedAt: new Date().toISOString().split("T")[0],
            }
          : l
      )
    )
    toast.success("Payment verified successfully")
    setDetailOpen(false)
    setSelectedLog(null)
  }

  function handleReject(id: string) {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection")
      return
    }
    setLogs(prev =>
      prev.map(l =>
        l.id === id ? { ...l, status: "rejected" as PaymentLogStatus, rejectionReason } : l
      )
    )
    toast.success("Payment rejected")
    setRejectOpen(false)
    setDetailOpen(false)
    setSelectedLog(null)
    setRejectionReason("")
  }

  function openDetail(log: PaymentLog) {
    setSelectedLog(log)
    setDetailOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit -ml-2 text-muted-foreground"
          onClick={() => router.push("/admin/fees")}
        >
          <ArrowLeft className="size-4 mr-1" /> Back to Fees
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{fee.title}</h1>
        <p className="text-sm text-muted-foreground">
          Payment Logs · {fee.semester} {fee.academicYear} · ₱{fee.amount.toLocaleString()}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard title="Pending"  value={pendingCount}  description="Awaiting verification" icon={Clock}        />
        <StatCard title="Verified" value={verifiedCount} description="Payments confirmed"    icon={CheckCircle}  />
        <StatCard title="Rejected" value={rejectedCount} description="Payments declined"     icon={XCircle}      />
        <StatCard title="Unpaid"   value={unpaidCount}   description="No submission yet"     icon={MinusCircle}  />
      </div>

      {/* Payment Logs */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-3">
              <div>
                <CardTitle className="text-base text-foreground">Payment Logs</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Manage and track payments for this fee
                </CardDescription>
              </div>
              <Tabs
                value={dataView}
                onValueChange={v => {
                  setDataView(v as "submissions" | "all-students")
                  setFilterStatus("all")
                }}
              >
                <TabsList>
                  <TabsTrigger value="submissions">Submissions</TabsTrigger>
                  <TabsTrigger value="all-students">All Students</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search student..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 w-48"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending_verification">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  {dataView === "all-students" && (
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}
                title={viewMode === "card" ? "Switch to table view" : "Switch to card view"}
              >
                {viewMode === "card" ? <List className="size-4" /> : <LayoutGrid className="size-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* ── SUBMISSIONS VIEW ── */}
          {dataView === "submissions" && (
            viewMode === "table" ? (
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount Paid</TableHead>
                      <TableHead>Paid At</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map(log => {
                      const config = statusConfig[log.status]
                      const Icon = config.icon
                      return (
                        <TableRow key={log.id}>
                          <TableCell className="text-xs font-mono text-muted-foreground">
                            {log.studentId}
                          </TableCell>
                          <TableCell className="text-sm font-medium text-foreground">
                            {log.studentName}
                          </TableCell>
                          <TableCell>
                            <Badge variant={config.variant} className="flex items-center gap-1 w-fit text-xs">
                              <Icon className="size-3" />
                              {config.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            ₱{log.amountPaid.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{log.paidAt}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => openDetail(log)}>
                              <Eye className="size-3 mr-1" /> View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {filteredLogs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                          No payment submissions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredLogs.map(log => {
                  const config = statusConfig[log.status]
                  const Icon = config.icon
                  return (
                    <Card key={log.id} className="border-border">
                      <CardContent className="pt-4 pb-3">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{log.studentName}</p>
                            <p className="text-xs font-mono text-muted-foreground">{log.studentId}</p>
                          </div>
                          <Badge variant={config.variant} className="flex items-center gap-1 text-xs shrink-0">
                            <Icon className="size-3" />
                            {config.label}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-foreground">
                            ₱{log.amountPaid.toLocaleString()}
                          </span>
                          <Button size="sm" variant="outline" onClick={() => openDetail(log)}>
                            <Eye className="size-3 mr-1" /> View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
                {filteredLogs.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-sm text-muted-foreground">No payment submissions found</p>
                  </div>
                )}
              </div>
            )
          )}

          {/* ── ALL STUDENTS VIEW ── */}
          {dataView === "all-students" && (
            viewMode === "table" ? (
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount Paid</TableHead>
                      <TableHead>Paid At</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRows.map(row => {
                      const config = statusConfig[row.status]
                      const Icon = config.icon
                      return (
                        <TableRow key={row.studentId}>
                          <TableCell className="text-xs font-mono text-muted-foreground">
                            {row.studentId}
                          </TableCell>
                          <TableCell className="text-sm font-medium text-foreground">
                            {row.studentName}
                          </TableCell>
                          <TableCell>
                            <Badge variant={config.variant} className="flex items-center gap-1 w-fit text-xs">
                              <Icon className="size-3" />
                              {config.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {row.log ? `₱${row.log.amountPaid.toLocaleString()}` : "—"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {row.log?.paidAt ?? "—"}
                          </TableCell>
                          <TableCell>
                            {row.log ? (
                              <Button size="sm" variant="outline" onClick={() => openDetail(row.log!)}>
                                <Eye className="size-3 mr-1" /> View Details
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">No submission</span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {filteredRows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                          No students found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRows.map(row => {
                  const config = statusConfig[row.status]
                  const Icon = config.icon
                  return (
                    <Card key={row.studentId} className="border-border">
                      <CardContent className="pt-4 pb-3">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{row.studentName}</p>
                            <p className="text-xs font-mono text-muted-foreground">{row.studentId}</p>
                          </div>
                          <Badge variant={config.variant} className="flex items-center gap-1 text-xs shrink-0">
                            <Icon className="size-3" />
                            {config.label}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-foreground">
                            {row.log ? `₱${row.log.amountPaid.toLocaleString()}` : "—"}
                          </span>
                          {row.log ? (
                            <Button size="sm" variant="outline" onClick={() => openDetail(row.log!)}>
                              <Eye className="size-3 mr-1" /> View Details
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">No submission</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
                {filteredRows.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-sm text-muted-foreground">No students found</p>
                  </div>
                )}
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Payment Detail Modal */}
      {selectedLog && (
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
              <DialogDescription>Fee: {fee.title}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              {/* Status Badge */}
              {(() => {
                const config = statusConfig[selectedLog.status]
                const Icon = config.icon
                return (
                  <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
                    <Icon className="size-3" />
                    {config.label}
                  </Badge>
                )
              })()}

              <Separator />

              {/* Student Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="text-sm font-medium text-foreground">{selectedLog.studentName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Student ID</p>
                  <p className="text-sm font-mono text-foreground">{selectedLog.studentId}</p>
                </div>
              </div>

              <Separator />

              {/* Receipt Image */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Receipt Image</p>
                <div className="relative h-40 w-full rounded-md border border-border bg-muted overflow-hidden flex items-center justify-center">
                  <Image
                    src={selectedLog.receiptImage}
                    alt="Payment receipt"
                    fill
                    className="object-contain"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none" }}
                  />
                  <span className="text-xs text-muted-foreground">Receipt Preview</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Amount Paid</p>
                  <p className="text-sm font-bold text-foreground">₱{selectedLog.amountPaid.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Payment Method</p>
                  <p className="text-sm text-foreground">
                    {paymentMethodLabels[selectedLog.paymentMethod] ?? selectedLog.paymentMethod}
                  </p>
                </div>
                {selectedLog.gcashReferenceNumber && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">GCash Reference No.</p>
                    <p className="text-sm font-mono text-foreground">{selectedLog.gcashReferenceNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Paid At</p>
                  <p className="text-sm text-foreground">{selectedLog.paidAt}</p>
                </div>
              </div>

              {/* Verified info — only shown when verified */}
              {selectedLog.status === "verified" && (
                <>
                  <Separator />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Verified By</p>
                      <p className="text-sm text-foreground">{selectedLog.verifiedBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Verified At</p>
                      <p className="text-sm text-foreground">{selectedLog.verifiedAt}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Rejection reason — only shown when rejected */}
              {selectedLog.status === "rejected" && selectedLog.rejectionReason && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">Reason for Rejection</p>
                    <p className="text-sm text-foreground">{selectedLog.rejectionReason}</p>
                  </div>
                </>
              )}
            </div>

            {/* Approve / Reject — only for pending */}
            {selectedLog.status === "pending_verification" && (
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  className="text-destructive border-destructive hover:bg-destructive/10"
                  onClick={() => { setDetailOpen(false); setRejectOpen(true) }}
                >
                  <XCircle className="size-4 mr-1" /> Reject
                </Button>
                <Button onClick={() => handleApprove(selectedLog.id)}>
                  <CheckCircle className="size-4 mr-1" /> Approve
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Reason Modal */}
      {selectedLog && (
        <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Reject Payment</DialogTitle>
              <DialogDescription>
                Provide a reason for rejecting {selectedLog.studentName}&apos;s payment.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reject-reason">Reason</Label>
              <Textarea
                id="reject-reason"
                placeholder="e.g. Receipt image is unclear..."
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => handleReject(selectedLog.id)}>
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
