"use client"

import { useState, useRef } from "react"
import { ShieldCheck, Download, Check, X, Clock, Eye, PenLine } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { PageHeader } from "@/components/shared/PageHeader"
import { SearchInput } from "@/components/shared/SearchInput"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/src/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/src/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/src/components/ui/select"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Separator } from "@/src/components/ui/separator"
import { Checkbox } from "@/src/components/ui/checkbox"
import { clearances as initialClearances } from "./mock-data"
import { PaymentReviewDialog } from "@/components/shared/PaymentReviewDialog"
import PaymentReceiptDialog from "@/src/features/admin/payments/components/PaymentReceiptDialog"
import type { ReceiptData } from "@/src/features/admin/payments/components/PaymentReceiptDialog"
import type { Clearance, ClearanceItemStatus, ClearanceBreakdownItem } from "./types"
import { toast } from "sonner"
import { StatCard } from "@/components/shared/StatCard"
import { DataPagination } from "@/components/shared/DataPagination"
import { Users, AlertTriangle } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { ViewToggle } from "@/components/shared/ViewToggle"
import type { ViewMode } from "@/components/shared/ViewToggle"

const ITEMS_PER_PAGE = 10

const overallVariant: Record<ClearanceItemStatus, "secondary" | "destructive" | "outline"> = {
  cleared: "secondary",
  "not-cleared": "destructive",
  pending: "outline",
}

const reqIcon: Record<ClearanceItemStatus, typeof Check> = {
  cleared: Check,
  pending: Clock,
  "not-cleared": X,
}

function RequirementsBreakdown({
  clearanceId,
  requirements,
  onReviewPayment,
  onLogPayment,
}: {
  clearanceId: string
  requirements: Clearance["requirements"]
  onReviewPayment: (clearanceId: string, reqName: string, item: ClearanceBreakdownItem) => void
  onLogPayment: (clearanceId: string) => void
}) {
  const pendingSubmissions = requirements.flatMap(r =>
    (r.items ?? []).filter(item => item.pendingPayment).map(item => ({ reqName: r.name, item }))
  )
  const notClearedWithoutPending = requirements.some(r =>
    r.status !== "cleared" && (r.items ?? []).some(item => item.status === "not-cleared" && !item.pendingPayment)
  )

  return (
    <div className="flex flex-col gap-3 py-4">
      {requirements.map(r => {
        const StatusIcon = reqIcon[r.status]
        return (
          <div
            key={r.name}
            className={cn(
              "rounded-md border p-3",
              r.status === "cleared" ? "border-success/30 bg-success/5"
              : r.status === "not-cleared" ? "border-destructive/30 bg-destructive/5"
              : "border-warning/30 bg-warning/5"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex size-6 items-center justify-center rounded-full",
                  r.status === "cleared" ? "bg-success/20" : r.status === "not-cleared" ? "bg-destructive/20" : "bg-warning/20"
                )}>
                  <StatusIcon className={cn("size-3", r.status === "cleared" ? "text-success" : r.status === "not-cleared" ? "text-destructive" : "text-warning-foreground")} />
                </div>
                <span className="text-sm font-semibold text-foreground">{r.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge variant={overallVariant[r.status]} className="capitalize text-xs">
                  {r.status.replace("-", " ")}
                </Badge>
              </div>
            </div>
            {(r.items ?? []).length > 0 ? (
              <div className="flex flex-col gap-2 mt-1 pl-1">
                {(r.items ?? []).map(item => {
                  const ItemIcon = reqIcon[item.status]
                  return (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <ItemIcon className={cn("size-3 shrink-0", item.status === "cleared" ? "text-success" : item.status === "not-cleared" ? "text-destructive" : "text-warning-foreground")} />
                        <span>{item.label}</span>
                        {item.amount != null && <span className="text-muted-foreground/60">₱{item.amount}</span>}
                      </div>
                      <span className={cn(
                        "font-medium capitalize",
                        item.status === "cleared" && "text-success",
                        item.status === "pending" && "text-warning-foreground",
                        item.status === "not-cleared" && "text-destructive",
                      )}>{item.status.replace("-", " ")}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground pl-1">No outstanding {r.name.toLowerCase()}.</p>
            )}
          </div>
        )
      })}
      {pendingSubmissions.length > 0 && (
        <div className="flex flex-col gap-2">
          {pendingSubmissions.map(({ reqName, item }) => (
            <Button
              key={item.label}
              size="sm"
              variant="outline"
              className="w-full gap-1.5 border-warning/40 text-warning-foreground hover:bg-warning/10"
              onClick={() => onReviewPayment(clearanceId, reqName, item)}
            >
              <Eye className="size-3.5" /> Review Payment Submission
            </Button>
          ))}
        </div>
      )}
      {notClearedWithoutPending && (
        <Button
          size="sm"
          variant="outline"
          className="w-full gap-1.5 border-[#1B5E20]/40 text-[#1B5E20] hover:bg-[#C8E6C9] hover:text-[#1B5E20] dark:text-green-400 dark:border-green-500/30 dark:hover:bg-green-950"
          onClick={() => onLogPayment(clearanceId)}
        >
          <PenLine className="size-3.5" /> Log Payment Manually
        </Button>
      )}
    </div>
  )
}

export default function ClearancePage() {
  const [clearanceList, setClearanceList] = useState(initialClearances)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [currentPage, setCurrentPage] = useState(1)

  // Payment review state
  const [reviewTarget, setReviewTarget] = useState<{
    clearanceId: string
    reqName: string
    item: ClearanceBreakdownItem
  } | null>(null)
  const [paymentReviewOpen, setPaymentReviewOpen] = useState(false)

  // Log payment manually state
  const [logPaymentTarget, setLogPaymentTarget] = useState<Clearance | null>(null)
  const [logPaymentOpen, setLogPaymentOpen] = useState(false)
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10))

  // Receipt state
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)
  const idCounter = useRef(0)

  function openPaymentReview(clearanceId: string, reqName: string, item: ClearanceBreakdownItem) {
    setReviewTarget({ clearanceId, reqName, item })
    setPaymentReviewOpen(true)
  }

  function updateCoveredItemStatuses(clearanceId: string, covered: Array<{ reqName: string; label: string }>, newStatus: ClearanceItemStatus) {
    const byReq = covered.reduce<Record<string, string[]>>((acc, ci) => {
      if (!acc[ci.reqName]) acc[ci.reqName] = []
      acc[ci.reqName].push(ci.label)
      return acc
    }, {})
    setClearanceList(prev => prev.map(c => {
      if (c.id !== clearanceId) return c
      const updatedReqs = c.requirements.map(r => {
        const labels = byReq[r.name]
        if (!labels) return r
        const updatedItems = (r.items ?? []).map(i =>
          labels.includes(i.label) ? { ...i, status: newStatus, pendingPayment: undefined } : i
        )
        const allCleared = updatedItems.every(i => i.status === "cleared")
        const anyNotCleared = updatedItems.some(i => i.status === "not-cleared")
        const anyPending = updatedItems.some(i => i.status === "pending")
        const reqStatus: ClearanceItemStatus = allCleared ? "cleared" : anyNotCleared ? "not-cleared" : anyPending ? "pending" : "cleared"
        return { ...r, items: updatedItems, status: reqStatus }
      })
      const allReqsCleared = updatedReqs.every(r => r.status === "cleared")
      const anyReqNotCleared = updatedReqs.some(r => r.status === "not-cleared")
      const anyReqPending = updatedReqs.some(r => r.status === "pending")
      const overallStatus: ClearanceItemStatus = allReqsCleared ? "cleared" : anyReqNotCleared ? "not-cleared" : anyReqPending ? "pending" : "cleared"
      return { ...c, requirements: updatedReqs, overallStatus }
    }))
  }

  function handleApprovePayment() {
    if (!reviewTarget) return
    const covered = reviewTarget.item.pendingPayment!.coveredItems
      ?.map(ci => ({ reqName: ci.reqName ?? reviewTarget.reqName, label: ci.label }))
      ?? [{ reqName: reviewTarget.reqName, label: reviewTarget.item.label }]
    updateCoveredItemStatuses(reviewTarget.clearanceId, covered, "cleared")
    toast.success("Payment approved — requirement cleared")
    setReviewTarget(null)
  }

  function handleRejectPayment(reason: string) {
    if (!reviewTarget) return
    const covered = reviewTarget.item.pendingPayment!.coveredItems
      ?.map(ci => ({ reqName: ci.reqName ?? reviewTarget.reqName, label: ci.label }))
      ?? [{ reqName: reviewTarget.reqName, label: reviewTarget.item.label }]
    updateCoveredItemStatuses(reviewTarget.clearanceId, covered, "not-cleared")
    toast.success(`Payment rejected${reason ? `: ${reason}` : ""}`)
    setReviewTarget(null)
  }

  // ── Log Payment Manually ──

  function openLogPayment(clearanceId: string) {
    const clearance = clearanceList.find(c => c.id === clearanceId) ?? null
    setLogPaymentTarget(clearance)
    setCheckedItems(new Set())
    setPaymentDate(new Date().toISOString().slice(0, 10))
    setLogPaymentOpen(true)
  }

  /** All not-cleared items without a pending submission for the selected student */
  const logPaymentItems = logPaymentTarget
    ? logPaymentTarget.requirements.flatMap(r =>
        (r.items ?? []).filter(i => i.status === "not-cleared" && !i.pendingPayment)
          .map(i => ({ reqName: r.name, label: i.label, amount: i.amount }))
      )
    : []

  const selectedLogItems = logPaymentItems.filter(i => checkedItems.has(`${i.reqName}::${i.label}`))
  const selectedLogTotal = selectedLogItems.reduce((s, i) => s + (i.amount ?? 0), 0)

  function toggleLogItem(key: string) {
    setCheckedItems(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function toggleAllLogItems() {
    const allKeys = logPaymentItems.map(i => `${i.reqName}::${i.label}`)
    const allChecked = allKeys.every(k => checkedItems.has(k))
    setCheckedItems(allChecked ? new Set() : new Set(allKeys))
  }

  function handleLogPayment() {
    if (!logPaymentTarget || selectedLogItems.length === 0) return
    const covered = selectedLogItems.map(i => ({ reqName: i.reqName, label: i.label }))
    updateCoveredItemStatuses(logPaymentTarget.id, covered, "cleared")

    // Check if student is now fully cleared
    const updatedClearance = clearanceList.find(c => c.id === logPaymentTarget.id)
    const remainingNotCleared = updatedClearance
      ? updatedClearance.requirements.flatMap(r => (r.items ?? []).filter(i => i.status === "not-cleared" && !i.pendingPayment))
          .filter(i => !covered.some(c => c.label === i.label))
      : []
    const willBeFullyCleared = remainingNotCleared.length === 0
      && updatedClearance?.requirements.every(r =>
        (r.items ?? []).every(i => i.status === "cleared" || covered.some(c => c.label === i.label))
      )

    // Generate receipt
    idCounter.current += 1
    const receiptId = `CLR-${idCounter.current}-${paymentDate}`
    setReceiptData({
      receiptId,
      studentName: logPaymentTarget.studentName,
      studentId: logPaymentTarget.studentId,
      items: selectedLogItems.map(i => ({
        name: i.label,
        type: i.reqName.toLowerCase().includes("fine") ? "fine" as const : "fee" as const,
        amount: i.amount ?? 0,
      })),
      total: selectedLogTotal,
      date: paymentDate,
    })

    setLogPaymentOpen(false)
    setReceiptOpen(true)

    if (willBeFullyCleared) {
      toast.success(`Payment logged — ${logPaymentTarget.studentName} is now fully cleared!`)
    } else {
      toast.success(`Payment logged — ${selectedLogItems.length} item${selectedLogItems.length !== 1 ? "s" : ""} cleared`)
    }
    setLogPaymentTarget(null)
  }

  const filtered = clearanceList.filter(c => {
    const matchesSearch = c.studentName.toLowerCase().includes(search.toLowerCase()) || c.studentId.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === "all" || c.overallStatus === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const cleared = clearanceList.filter(c => c.overallStatus === "cleared").length
  const pending = clearanceList.filter(c => c.overallStatus === "pending").length
  const notCleared = clearanceList.filter(c => c.overallStatus === "not-cleared").length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        variant="admin"
        title="Clearance Management"
        context="2nd Semester · A.Y. 2025–2026"
        description="Review and manage student clearance statuses"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Cleared" value={cleared} description="Students fully cleared" icon={ShieldCheck} />
        <StatCard title="Pending" value={pending} description="Awaiting requirements" icon={Users} />
        <StatCard title="Not Cleared" value={notCleared} description="Outstanding payments" icon={AlertTriangle} />
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">Clearance Records</CardTitle>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SearchInput
                placeholder="Search student..."
                value={search}
                onChange={v => { setSearch(v); setCurrentPage(1) }}
                className="w-full sm:w-56"
              />
              <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="cleared">Cleared</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="not-cleared">Not Cleared</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Export started (mock)")}>
                <Download className="size-4" /> Export
              </Button>
              <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "card" ? (
            paginated.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">No clearance records found.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paginated.map(c => (
                  <Card key={c.id} className="border-border bg-card">
                  <CardContent className="flex flex-col gap-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{c.studentName}</p>
                        <p className="text-xs text-muted-foreground">{c.studentId}</p>
                      </div>
                      <Badge variant={overallVariant[c.overallStatus]} className="capitalize shrink-0">
                        {c.overallStatus.replace("-", " ")}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-2">
                      {c.requirements.map(r => {
                        const Icon = reqIcon[r.status]
                        return (
                          <div key={r.name} className={cn(
                            "flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs",
                            r.status === "cleared" && "bg-success/10",
                            r.status === "pending" && "bg-warning/10",
                            r.status === "not-cleared" && "bg-destructive/10",
                          )}>
                            <span className={cn(
                              "font-medium",
                              r.status === "cleared" && "text-success",
                              r.status === "pending" && "text-warning-foreground",
                              r.status === "not-cleared" && "text-destructive",
                            )}>{r.name}</span>
                            <Icon className={cn(
                              "size-3.5",
                              r.status === "cleared" && "text-success",
                              r.status === "pending" && "text-warning-foreground",
                              r.status === "not-cleared" && "text-destructive",
                            )} />
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-auto pt-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs"><Eye className="size-3.5" /> View Details</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-foreground">Clearance — {c.studentName}</DialogTitle>
                            <DialogDescription className="text-muted-foreground">{c.studentId}</DialogDescription>
                          </DialogHeader>
                          <RequirementsBreakdown clearanceId={c.id} requirements={c.requirements} onReviewPayment={openPaymentReview} onLogPayment={openLogPayment} />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                  </Card>
                ))}
              </div>
            )
          ) : (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead>Student</TableHead>
                  <TableHead>Requirements</TableHead>
                  <TableHead>Overall Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map(c => (
                  <TableRow key={c.id} className="border-border">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{c.studentName}</span>
                        <span className="text-xs text-muted-foreground">{c.studentId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        {c.requirements.map(r => (
                          <span
                            key={r.name}
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                              r.status === "cleared" && "bg-success/10 text-success",
                              r.status === "pending" && "bg-warning/10 text-warning-foreground",
                              r.status === "not-cleared" && "bg-destructive/10 text-destructive",
                            )}
                          >
                            {r.name}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={overallVariant[c.overallStatus]} className="capitalize">
                        {c.overallStatus.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Eye className="size-3.5" /> View Details</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-foreground">Clearance — {c.studentName}</DialogTitle>
                            <DialogDescription className="text-muted-foreground">{c.studentId}</DialogDescription>
                          </DialogHeader>
                          <RequirementsBreakdown clearanceId={c.id} requirements={c.requirements} onReviewPayment={openPaymentReview} onLogPayment={openLogPayment} />
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No clearance records found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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

      {/* ── Dialog 1: Payment Review ───────────────────────────────── */}
      <PaymentReviewDialog
        open={paymentReviewOpen}
        onOpenChange={setPaymentReviewOpen}
        data={reviewTarget ? (() => {
          const p = reviewTarget.item.pendingPayment!
          const raw = p.coveredItems
            ?? [{ reqName: reviewTarget.reqName, label: reviewTarget.item.label, amount: reviewTarget.item.amount }]
          const uniqueGroups = [...new Set(raw.map(ci => ci.reqName ?? reviewTarget.reqName))]
          return {
            lineItems: raw.map(ci => ({
              label: ci.label,
              amount: ci.amount,
              group: uniqueGroups.length > 1 ? (ci.reqName ?? reviewTarget.reqName) : undefined,
            })),
            amountPaid: p.amountPaid,
            paymentMethod: p.method,
            referenceNo: p.referenceNo,
            submittedAt: p.submittedAt,
            approveConfirmMessage: "The corresponding requirement(s) will be marked as cleared.",
          }
        })() : null}
        onApprove={handleApprovePayment}
        onReject={handleRejectPayment}
      />
      <Dialog open={logPaymentOpen} onOpenChange={setLogPaymentOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Log Payment Manually — {logPaymentTarget?.studentName}</DialogTitle>
            <DialogDescription>{logPaymentTarget?.studentId}</DialogDescription>
          </DialogHeader>

          {logPaymentTarget && logPaymentItems.length > 0 && (
            <div className="flex flex-col gap-4">
              {/* Payable items with checkboxes */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground">Unsettled Items</p>
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={toggleAllLogItems}
                  >
                    {logPaymentItems.every(i => checkedItems.has(`${i.reqName}::${i.label}`)) ? "Deselect All" : "Select All"}
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  {logPaymentItems.map(item => {
                    const key = `${item.reqName}::${item.label}`
                    return (
                      <label
                        key={key}
                        className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors has-[button[data-state=checked]]:border-primary/40 has-[button[data-state=checked]]:bg-primary/5"
                      >
                        <Checkbox
                          checked={checkedItems.has(key)}
                          onCheckedChange={() => toggleLogItem(key)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground leading-snug">{item.label}</p>
                          <Badge variant="outline" className="mt-1 text-[10px] capitalize">{item.reqName}</Badge>
                        </div>
                        {item.amount != null && (
                          <span className="text-sm font-semibold text-foreground shrink-0">₱{item.amount.toLocaleString()}</span>
                        )}
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Selected total */}
              {selectedLogItems.length > 0 && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      Selected ({selectedLogItems.length} item{selectedLogItems.length !== 1 ? "s" : ""})
                    </span>
                    <span className="text-base font-bold text-foreground">₱{selectedLogTotal.toLocaleString()}</span>
                  </div>
                </>
              )}

              {/* Payment date */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="clearancePaymentDate">Date of Payment <span className="text-destructive">*</span></Label>
                <Input
                  id="clearancePaymentDate"
                  type="date"
                  value={paymentDate}
                  onChange={e => setPaymentDate(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setLogPaymentOpen(false)}>Cancel</Button>
            <Button
              disabled={selectedLogItems.length === 0}
              className="gap-1.5 border-[#1B5E20]/40 bg-[#1B5E20] text-white hover:bg-[#2E7D32] dark:bg-green-700 dark:hover:bg-green-600"
              onClick={handleLogPayment}
            >
              <PenLine className="size-3.5" />
              Log Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PaymentReceiptDialog
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        data={receiptData}
      />
    </div>
  )
}
