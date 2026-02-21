"use client"

import { Banknote, Check, Clock, CreditCard, X, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Separator } from "@/src/components/ui/separator"
import { Button } from "@/src/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import {
  currentStudentFees,
  currentStudentPaymentLogs,
  currentStudent,
  GCASH_ACCOUNT_NAME,
  GCASH_ACCOUNT_NUMBER,
} from "./mock-data"
import { cn } from "@/src/lib/utils"
import type { Fee } from "./types"
import { toast } from "sonner"
import type { FeeType } from "./types"

type StudentFeeStatus = "paid" | "pending" | "rejected" | "unpaid"

const feeTypeLabels: Record<FeeType, string> = {
  "semester-membership": "Semester Membership",
  "event-fee":           "Event Fee",
  "charity-fee":         "Charity Fee",
  "organization-dues":   "Organization Dues",
}

const statusConfig: Record<
  StudentFeeStatus,
  { label: string; variant: "secondary" | "destructive" | "outline" | "default"; icon: typeof Check; iconColor: string }
> = {
  paid:     { label: "Paid",                 variant: "secondary",   icon: Check,         iconColor: "text-success"               },
  pending:  { label: "Pending Verification", variant: "default",     icon: Clock,         iconColor: "text-muted-foreground"      },
  rejected: { label: "Rejected",             variant: "destructive", icon: AlertTriangle, iconColor: "text-destructive"           },
  unpaid:   { label: "Unpaid",               variant: "destructive", icon: X,             iconColor: "text-destructive"           },
}

function getStudentStatus(feeId: string): StudentFeeStatus {
  const log = currentStudentPaymentLogs.find(l => l.feeId === feeId)
  if (!log) return "unpaid"
  if (log.status === "verified")             return "paid"
  if (log.status === "pending_verification") return "pending"
  if (log.status === "rejected")             return "rejected"
  return "unpaid"
}

export default function PortalFeesPage() {
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null)
  const [referenceCode, setReferenceCode] = useState("")
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [amount, setAmount] = useState("")

  function openPaymentModal(fee: Fee) {
    setSelectedFee(fee)
    setAmount(fee.amount.toString())
    setPaymentOpen(true)
  }

  function handlePaymentSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!referenceCode || !receiptFile || !amount) {
      toast.error("Please fill in all fields")
      return
    }
    toast.success("Payment submitted for review. You will be notified once the admin verifies your payment.")
    setPaymentOpen(false)
    setReferenceCode("")
    setReceiptFile(null)
    setAmount("")
    setSelectedFee(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Fees</h1>
        <p className="text-sm text-muted-foreground">Your USSC fee records</p>
      </div>

      {/* Student Info Card */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                {currentStudent.firstName} {currentStudent.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentStudent.studentId} &mdash; {currentStudent.course}
              </p>
            </div>
            <Badge variant="secondary" className="w-fit">Active Member</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Fee Records */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Fee History</h3>
        {currentStudentFees.map(fee => {
          const studentStatus = getStudentStatus(fee.id)
          const config = statusConfig[studentStatus]
          const Icon = config.icon
          const log = currentStudentPaymentLogs.find(l => l.feeId === fee.id)

          return (
            <Card key={fee.id} className="border-border">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex size-10 items-center justify-center rounded-full",
                        studentStatus === "paid"    ? "bg-success/10"     :
                        studentStatus === "pending" ? "bg-muted"          :
                                                      "bg-destructive/10"
                      )}>
                        <Banknote className={cn("size-5", config.iconColor)} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{fee.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {feeTypeLabels[fee.type]} · {fee.semester} {fee.academicYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-lg font-bold text-foreground">₱{fee.amount.toLocaleString()}</span>
                      <Badge variant={config.variant} className="flex items-center gap-1 capitalize">
                        <Icon className="size-3" />
                        {config.label}
                      </Badge>
                    </div>
                  </div>

                  {/* Paid — show receipt info */}
                  {studentStatus === "paid" && log && (
                    <>
                      <Separator />
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Paid: {log.paidAt}</span>
                        <span>Method: {log.paymentMethod === "gcash" ? "GCash" : log.paymentMethod}</span>
                        {log.gcashReferenceNumber && (
                          <span className="font-mono">Ref: {log.gcashReferenceNumber}</span>
                        )}
                      </div>
                    </>
                  )}

                  {/* Pending — inform the student */}
                  {studentStatus === "pending" && (
                    <>
                      <Separator />
                      <p className="text-xs text-muted-foreground">
                        Your payment is under review. You will be notified once it is verified.
                      </p>
                    </>
                  )}

                  {/* Rejected — show reason and allow resubmission */}
                  {studentStatus === "rejected" && (
                    <>
                      <Separator />
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-medium text-destructive mb-0.5">Payment Rejected</p>
                          {log?.rejectionReason && (
                            <p className="text-xs text-muted-foreground">{log.rejectionReason}</p>
                          )}
                        </div>
                        <Button size="sm" variant="outline" onClick={() => openPaymentModal(fee)}>
                          <CreditCard className="size-4 mr-1" /> Resubmit
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Unpaid — show pay button */}
                  {studentStatus === "unpaid" && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Please submit your payment using the button below.
                        </p>
                        <Button size="sm" onClick={() => openPaymentModal(fee)}>
                          <CreditCard className="size-4 mr-1" /> Pay Now
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}

        {currentStudentFees.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Banknote className="size-12 text-muted-foreground" />
            <h3 className="mt-3 text-sm font-medium text-foreground">No fee records</h3>
            <p className="mt-1 text-xs text-muted-foreground">No fee records have been issued yet.</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Payment</DialogTitle>
            <DialogDescription>Pay via GCash and submit proof of payment</DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
            {selectedFee && (
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm font-medium mb-1">{selectedFee.title}</p>
                <p className="text-xs text-muted-foreground">
                  {feeTypeLabels[selectedFee.type]} · {selectedFee.semester} {selectedFee.academicYear}
                </p>
                <p className="text-lg font-bold mt-2">Amount: ₱{selectedFee.amount.toLocaleString()}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>GCash Details</Label>
                <div className="border border-border rounded-lg p-4 bg-background flex flex-col items-center gap-2">
                  <div className="w-40 h-40 bg-muted rounded flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">QR Code</p>
                  </div>
                  <p className="text-sm font-medium text-center">{GCASH_ACCOUNT_NAME}</p>
                  <p className="text-xs text-muted-foreground">{GCASH_ACCOUNT_NUMBER}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="referenceCode">GCash Reference No. <span className="text-destructive">*</span></Label>
                  <Input
                    id="referenceCode"
                    value={referenceCode}
                    onChange={e => setReferenceCode(e.target.value)}
                    placeholder="e.g. GC-2024-11-150001"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="amount">Amount Paid (₱) <span className="text-destructive">*</span></Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="receipt">Upload Receipt <span className="text-destructive">*</span></Label>
                  <Input
                    id="receipt"
                    type="file"
                    accept="image/*"
                    onChange={e => setReceiptFile(e.target.files?.[0] || null)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload a clear screenshot of your GCash receipt
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPaymentOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Payment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

