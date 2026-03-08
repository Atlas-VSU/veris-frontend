"use client"

import Image from "next/image"
import { ShieldCheck, Check, Clock, X, CreditCard } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
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
  "semestral-membership": "Semestral Membership",
  "organization-fee":   "Organization Fee",
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
      <div className="flex flex-col items-center justify-center py-16 text-center sm:py-20">
        <ShieldCheck className="size-10 text-muted-foreground sm:size-12" />
        <h2 className="mt-4 text-base font-bold uppercase tracking-wide text-foreground sm:text-lg">No Clearance Record</h2>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">No clearance record found for the current semester.</p>
      </div>
    )
  }

  const clearedCount = clearance.requirements.filter(r => r.status === "cleared").length
  const totalCount = clearance.requirements.length
  const progressPct = Math.round((clearedCount / totalCount) * 100)

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <PageHeader
        variant="portal"
        title="My Clearance"
        context={`${clearance.semester} · A.Y. ${clearance.academicYear}`}
        description="Track your clearance requirements for this semester"
      />

      {/* Overall Status Card */}
      <Card className="border-[#E0E0E0] bg-white shadow-sm">
        <CardContent className="p-4 sm:pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-full sm:size-14",
                clearance.overallStatus === "cleared"     ? "bg-[#8BC34A]/10"   :
                clearance.overallStatus === "not-cleared" ? "bg-destructive/10" : "bg-[#1B5E20]/10"
              )}>
                <ShieldCheck className={cn(
                  "size-5 sm:size-7",
                  clearance.overallStatus === "cleared"     ? "text-[#8BC34A]"   :
                  clearance.overallStatus === "not-cleared" ? "text-destructive" : "text-[#1B5E20]"
                )} />
              </div>
              <div>
                <h2 className="text-base font-bold uppercase tracking-wide text-foreground sm:text-xl">
                  {clearance.overallStatus.replace("-", " ")}
                </h2>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {clearedCount} of {totalCount} requirements completed
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <div className="w-full sm:max-w-xs">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{progressPct}%</span>
                </div>
                <Progress value={progressPct} className="mt-1 h-2" />
              </div>
              {payableItems.length > 0 && (
                <Button onClick={openModal} size="sm" className="w-full bg-[#1B5E20] text-white hover:bg-[#1B5E20]/90 font-semibold shadow-sm sm:w-auto">
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
      <div className="flex flex-col gap-3 sm:gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">Requirements</h3>
        {clearance.requirements.map(req => {
          const config = statusConfig[req.status]
          const Icon = config.icon
          return (
            <Card key={req.name} className={cn("border transition-colors duration-150", config.bgColor)}>
              <CardContent className="px-3 py-3 sm:py-4 sm:px-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className={cn("flex size-7 shrink-0 items-center justify-center rounded-full sm:size-8", config.iconBg)}>
                      <Icon className="size-3.5 sm:size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground sm:text-sm">{req.name}</p>
                      <p className="text-[10px] text-muted-foreground capitalize sm:text-xs">{req.status.replace("-", " ")}</p>
                    </div>
                  </div>
                  <Badge
                    variant={req.status === "cleared" ? "secondary" : req.status === "not-cleared" ? "destructive" : "outline"}
                    className="shrink-0 capitalize text-[10px] sm:text-xs"
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
        <DialogContent className="max-h-[90vh] max-w-[95vw] overflow-y-auto sm:max-w-2xl">

          {step === 1 && (
            <>
              <DialogHeader>
                <DialogTitle>Make Payment</DialogTitle>
                <DialogDescription>
                  Select the fees and fines you want to pay. All outstanding items are pre-selected.
                </DialogDescription>
              </DialogHeader>

              <div className="flex max-h-60 flex-col gap-2 overflow-y-auto pr-1 sm:max-h-80">
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
                      <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <Badge
                              variant={item.kind === "fine" ? "destructive" : "default"}
                              className="px-1.5 py-0 text-[10px] capitalize"
                            >
                              {item.kind}
                            </Badge>
                            <span className="text-sm font-medium text-foreground">{item.label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground line-clamp-2">{item.sublabel}</span>
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

              <DialogFooter className="flex-col gap-2 sm:flex-row">
                <Button variant="outline" onClick={() => setModalOpen(false)} className="w-full sm:w-auto">Cancel</Button>
                <Button onClick={handleNext} disabled={selectedIds.size === 0} className="w-full bg-[#1B5E20] text-white hover:bg-[#1B5E20]/90 font-semibold shadow-sm sm:w-auto">
                  Next: Payment Details
                </Button>
              </DialogFooter>
            </>
          )}

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
                <div className="rounded-lg border border-[#1B5E20]/10 bg-[#1B5E20]/2 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#1B5E20]/60">
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

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* GCash info */}
                  <div className="flex flex-col gap-2">
                    <Label>Pay via GCash</Label>
                    <div className="flex flex-col items-center gap-2 rounded-lg border border-[#1B5E20]/10 bg-[#1B5E20]/2 p-3 text-center sm:p-4">
                      <Image
                        src="/qr-code.png"
                        alt="GCash QR Code"
                        width={128}
                        height={128}
                        className="size-24 rounded-md sm:size-32"
                      />
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

              <DialogFooter className="flex-col gap-2 sm:flex-row">
                <Button variant="outline" onClick={() => setStep(1)} className="w-full sm:w-auto">Back</Button>
                <Button form="payment-form" type="submit" className="w-full bg-[#1B5E20] text-white hover:bg-[#1B5E20]/90 font-semibold shadow-sm sm:w-auto">Submit Payment</Button>
              </DialogFooter>
            </>
          )}

        </DialogContent>
      </Dialog>
    </div>
  )
}
