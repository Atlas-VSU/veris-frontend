"use client"

import { ShieldCheck, Check, Clock, X, CreditCard } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/PageHeader"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Progress } from "@/src/components/ui/progress"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { Separator } from "@/src/components/ui/separator"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/src/components/ui/dialog"
import { currentStudentClearance } from "./mock-data"
import {
  currentStudentFineRecord,
  currentStudentFees,
  currentStudentPaymentLogs,
  GCASH_ACCOUNT_NAME,
  GCASH_ACCOUNT_NUMBER,
} from "../mock-data"
import { cn } from "@/src/lib/utils"
import type { ClearanceItemStatus } from "./types"
import type { FeeType } from "../fees/types"
import { toast } from "sonner"

const feeTypeLabels: Record<FeeType, string> = {
  "semester-membership": "Semester Membership",
  "event-fee":           "Event Fee",
  "charity-fee":         "Charity Fee",
  "organization-dues":   "Organization Dues",
}

const statusConfig: Record<ClearanceItemStatus, { icon: typeof Check; color: string; bgColor: string; iconBg: string }> = {
  cleared:     { icon: Check,  color: "text-success",            bgColor: "border-success/20 bg-success/5",         iconBg: "bg-success text-success-foreground"       },
  pending:     { icon: Clock,  color: "text-warning-foreground", bgColor: "border-warning/20 bg-warning/5",         iconBg: "bg-warning text-warning-foreground"       },
  "not-cleared": { icon: X,   color: "text-destructive",        bgColor: "border-destructive/20 bg-destructive/5", iconBg: "bg-destructive/20 text-destructive"       },
}

type PayableItem = {
  id: string
  kind: "fee" | "fine"
  label: string
  sublabel: string
  amount: number
}

function getPayableItems(): PayableItem[] {
  const items: PayableItem[] = []

  // Unpaid or rejected fees
  for (const fee of currentStudentFees) {
    const log = currentStudentPaymentLogs.find(l => l.feeId === fee.id)
    const isUnpaid = !log
    const isRejected = log?.status === "rejected"
    if (isUnpaid || isRejected) {
      items.push({
        id: `fee-${fee.id}`,
        kind: "fee",
        label: fee.title,
        sublabel: `${feeTypeLabels[fee.type]} · ${fee.semester} ${fee.academicYear}${isRejected ? " · Previously rejected" : ""}`,
        amount: fee.amount,
      })
    }
  }

  // Outstanding fine items (not waived, bulk submission not pending/approved)
  const fineRecord = currentStudentFineRecord
  if (fineRecord) {
    const bulkStatus = fineRecord.bulkPaymentSubmission?.status
    const finesPayable = bulkStatus !== "pending" && bulkStatus !== "approved"
    if (finesPayable) {
      for (const fine of fineRecord.fineItems) {
        if (!fine.isWaived) {
          items.push({
            id: `fine-${fine.id}`,
            kind: "fine",
            label: fine.fineTypeName + (fine.eventName ? ` — ${fine.eventName}` : ""),
            sublabel: `${fine.reason} · Issued ${fine.issuedAt}`,
            amount: fine.amount,
          })
        }
      }
    }
  }

  return items
}

export default function PortalClearancePage() {
  const clearance = currentStudentClearance
  const payableItems = getPayableItems()

  const [modalOpen, setModalOpen] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(payableItems.map(i => i.id)))
  const [referenceCode, setReferenceCode] = useState("")
  const [receiptFile, setReceiptFile] = useState<File | null>(null)

  const selectedItems = payableItems.filter(i => selectedIds.has(i.id))
  const selectedTotal = selectedItems.reduce((s, i) => s + i.amount, 0)

  function toggleItem(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function openModal() {
    setSelectedIds(new Set(payableItems.map(i => i.id)))
    setStep(1)
    setReferenceCode("")
    setReceiptFile(null)
    setModalOpen(true)
  }

  function handleNext() {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one item to pay.")
      return
    }
    setStep(2)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!referenceCode || !receiptFile) {
      toast.error("Please fill in all required fields.")
      return
    }
    toast.success("Payment submitted for admin review.")
    setModalOpen(false)
  }

  if (!clearance) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldCheck className="size-12 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">No Clearance Record</h2>
        <p className="mt-1 text-sm text-muted-foreground">No clearance record found for the current semester.</p>
      </div>
    )
  }

  const clearedCount = clearance.requirements.filter(r => r.status === "cleared").length
  const totalCount = clearance.requirements.length
  const progressPct = Math.round((clearedCount / totalCount) * 100)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Clearance"
        context={`${clearance.semester} · A.Y. ${clearance.academicYear}`}
        description="Track your clearance requirements for this semester"
      />

      {/* Overall Status Card */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex size-14 items-center justify-center rounded-full",
                clearance.overallStatus === "cleared"     ? "bg-success/10"     :
                clearance.overallStatus === "not-cleared" ? "bg-destructive/10" : "bg-warning/10"
              )}>
                <ShieldCheck className={cn(
                  "size-7",
                  clearance.overallStatus === "cleared"     ? "text-success"     :
                  clearance.overallStatus === "not-cleared" ? "text-destructive" : "text-warning"
                )} />
              </div>
              <div>
                <h2 className="text-xl font-bold capitalize text-foreground">
                  {clearance.overallStatus.replace("-", " ")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {clearedCount} of {totalCount} requirements completed
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <div className="w-full max-w-xs">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{progressPct}%</span>
                </div>
                <Progress value={progressPct} className="mt-1 h-2" />
              </div>
              {payableItems.length > 0 && (
                <Button onClick={openModal} size="sm">
                  <CreditCard className="size-4" />
                  Make Payment
                  <span className="ml-1 text-xs opacity-75">
                    ({payableItems.length} item{payableItems.length !== 1 ? "s" : ""})
                  </span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Requirements</h3>
        {clearance.requirements.map(req => {
          const config = statusConfig[req.status]
          const Icon = config.icon
          return (
            <Card key={req.name} className={cn("border", config.bgColor)}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex size-8 items-center justify-center rounded-full", config.iconBg)}>
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{req.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{req.status.replace("-", " ")}</p>
                    </div>
                  </div>
                  <Badge
                    variant={req.status === "cleared" ? "secondary" : req.status === "not-cleared" ? "destructive" : "outline"}
                    className="capitalize"
                  >
                    {req.status.replace("-", " ")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Make Payment Dialog */}
      <Dialog open={modalOpen} onOpenChange={open => { setModalOpen(open); if (!open) setStep(1) }}>
        <DialogContent className="max-w-2xl">

          {/* ── Step 1: Select items ───────────────────────────────────── */}
          {step === 1 && (
            <>
              <DialogHeader>
                <DialogTitle>Make Payment</DialogTitle>
                <DialogDescription>
                  Select the fees and fines you want to pay. All outstanding items are pre-selected.
                </DialogDescription>
              </DialogHeader>

              <div className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-1">
                {payableItems.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No outstanding items to pay.
                  </p>
                ) : (
                  payableItems.map(item => (
                    <label
                      key={item.id}
                      htmlFor={`item-${item.id}`}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                        selectedIds.has(item.id)
                          ? "border-primary/40 bg-primary/5"
                          : "border-border bg-background hover:bg-muted/30"
                      )}
                    >
                      <Checkbox
                        id={`item-${item.id}`}
                        checked={selectedIds.has(item.id)}
                        onCheckedChange={() => toggleItem(item.id)}
                        className="mt-0.5 shrink-0"
                      />
                      <div className="flex flex-1 items-start justify-between gap-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={item.kind === "fine" ? "destructive" : "default"}
                              className="px-1.5 py-0 text-[10px] capitalize"
                            >
                              {item.kind}
                            </Badge>
                            <span className="text-sm font-medium text-foreground">{item.label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{item.sublabel}</span>
                        </div>
                        <span className="shrink-0 text-sm font-semibold text-foreground">
                          ₱{item.amount.toLocaleString()}
                        </span>
                      </div>
                    </label>
                  ))
                )}
              </div>

              {selectedItems.length > 0 && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm text-muted-foreground">
                      {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""} selected
                    </span>
                    <span className="text-base font-bold text-foreground">
                      Total: ₱{selectedTotal.toLocaleString()}
                    </span>
                  </div>
                </>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button onClick={handleNext} disabled={selectedIds.size === 0}>
                  Next: Payment Details
                </Button>
              </DialogFooter>
            </>
          )}

          {/* ── Step 2: Payment details ────────────────────────────────── */}
          {step === 2 && (
            <>
              <DialogHeader>
                <DialogTitle>Payment Details</DialogTitle>
                <DialogDescription>
                  Send payment via GCash then fill in the details below.
                </DialogDescription>
              </DialogHeader>

              <form id="payment-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Selected items summary */}
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Items Being Paid
                  </p>
                  <div className="flex flex-col divide-y divide-border">
                    {selectedItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={item.kind === "fine" ? "destructive" : "default"}
                            className="px-1.5 py-0 text-[10px] capitalize"
                          >
                            {item.kind}
                          </Badge>
                          <span className="text-sm text-foreground">{item.label}</span>
                        </div>
                        <span className="text-sm font-medium text-foreground">₱{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-semibold">Total</span>
                      <span className="text-sm font-semibold">₱{selectedTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  {/* GCash info */}
                  <div className="flex flex-col gap-2">
                    <Label>Pay via GCash</Label>
                    <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background p-4 text-center">
                      <div className="flex size-32 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                        QR Code Placeholder
                      </div>
                      <p className="text-sm font-medium">{GCASH_ACCOUNT_NAME}</p>
                      <p className="text-xs text-muted-foreground">{GCASH_ACCOUNT_NUMBER}</p>
                    </div>
                  </div>

                  {/* Submission fields */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="refCode">
                        GCash Reference No. <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="refCode"
                        value={referenceCode}
                        onChange={e => setReferenceCode(e.target.value)}
                        placeholder="e.g. GC-2024-11-150001"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="amountPaid">Amount Paid (₱)</Label>
                      <Input
                        id="amountPaid"
                        type="number"
                        value={selectedTotal}
                        readOnly
                        className="cursor-not-allowed bg-muted/30"
                      />
                      <p className="text-xs text-muted-foreground">
                        Based on your selected items.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="receipt">
                        Upload Receipt <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="receipt"
                        type="file"
                        accept="image/*"
                        onChange={e => setReceiptFile(e.target.files?.[0] || null)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload a clear screenshot of your GCash receipt.
                      </p>
                    </div>
                  </div>
                </div>
              </form>

              <DialogFooter>
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button form="payment-form" type="submit">Submit Payment</Button>
              </DialogFooter>
            </>
          )}

        </DialogContent>
      </Dialog>
    </div>
  )
}
