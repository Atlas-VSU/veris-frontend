"use client"

import { Banknote, Receipt, Check, Clock, X, CreditCard } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Separator } from "@/src/components/ui/separator"
import { Button } from "@/src/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { currentStudentFees, currentStudent, GCASH_QR_CODE, GCASH_ACCOUNT_NAME, GCASH_ACCOUNT_NUMBER } from "./mock-data"
import { cn } from "@/src/lib/utils"
import type { FeeStatus, MembershipFee } from "./types"
import { toast } from "sonner"
import Image from "next/image"

const statusConfig: Record<FeeStatus, { label: string; variant: "secondary" | "destructive" | "outline"; icon: typeof Check; color: string }> = {
  paid: { label: "Paid", variant: "secondary", icon: Check, color: "text-success" },
  unpaid: { label: "Unpaid", variant: "destructive", icon: X, color: "text-destructive" },
  partial: { label: "Partial", variant: "outline", icon: Clock, color: "text-warning-foreground" },
}

export default function PortalFeesPage() {
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [selectedFee, setSelectedFee] = useState<MembershipFee | null>(null)
  const [referenceCode, setReferenceCode] = useState("")
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [amount, setAmount] = useState("")

  function openPaymentModal(fee: MembershipFee) {
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
    toast.success("Payment submitted for review. You will be notified once the admin reviews your payment.")
    setPaymentOpen(false)
    setReferenceCode("")
    setReceiptFile(null)
    setAmount("")
    setSelectedFee(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Membership Fees</h1>
        <p className="text-sm text-muted-foreground">Your USSC membership fee records</p>
      </div>

      {/* Student Info Card */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{currentStudent.firstName} {currentStudent.lastName}</p>
              <p className="text-xs text-muted-foreground">{currentStudent.studentId} -- {currentStudent.course}</p>
            </div>
            <Badge variant="secondary" className="w-fit">Active Member</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Fee Records */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Fee History</h3>
        {currentStudentFees.map(fee => {
          const config = statusConfig[fee.status]
          const Icon = config.icon
          return (
            <Card key={fee.id} className="border-border">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex size-10 items-center justify-center rounded-full",
                        fee.status === "paid" ? "bg-success/10" :
                          fee.status === "unpaid" ? "bg-destructive/10" : "bg-warning/10"
                      )}>
                        <Banknote className={cn("size-5", config.color)} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{fee.semester}</p>
                        <p className="text-xs text-muted-foreground">{fee.academicYear}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-lg font-bold text-foreground">P{fee.amount}</span>
                      <Badge variant={config.variant} className="capitalize">{config.label}</Badge>
                    </div>
                  </div>

                  {fee.status === "paid" && (
                    <>
                      <Separator />
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Receipt className="size-3" />
                          Receipt: {fee.receiptNo || "N/A"}
                        </span>
                        <span>Paid: {fee.paidDate}</span>
                      </div>
                    </>
                  )}

                  {fee.status === "unpaid" && (
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
            <p className="mt-1 text-xs text-muted-foreground">No membership fee records found.</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Payment for Membership Fee</DialogTitle>
            <DialogDescription>Pay via GCash and submit proof of payment</DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
            {selectedFee && (
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm font-medium mb-1">Membership Fee Details:</p>
                <p className="text-sm text-muted-foreground">{selectedFee.academicYear} - {selectedFee.semester}</p>
                <p className="text-lg font-bold mt-2">Amount: ₱{selectedFee.amount}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>GCash QR Code</Label>
                <div className="border border-border rounded-lg p-4 bg-background">
                  <div className="bg-white p-4 rounded">
                    <p className="text-sm text-center mb-2">Scan to pay</p>
                    <div className="w-48 h-48 mx-auto bg-gray-200 rounded flex items-center justify-center">
                      <p className="text-xs text-gray-500">QR Code</p>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm font-medium">{GCASH_ACCOUNT_NAME}</p>
                      <p className="text-xs text-muted-foreground">{GCASH_ACCOUNT_NUMBER}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="referenceCode">GCash Reference Code *</Label>
                  <Input
                    id="referenceCode"
                    value={referenceCode}
                    onChange={(e) => setReferenceCode(e.target.value)}
                    placeholder="e.g., GC-2024-11-150001"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="amount">Amount Paid *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="150"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="receipt">Upload GCash Receipt *</Label>
                  <Input
                    id="receipt"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
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
              <Button type="submit">
                Submit Payment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
