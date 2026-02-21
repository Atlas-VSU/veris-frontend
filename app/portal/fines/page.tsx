"use client"

import { AlertTriangle, CheckCircle, Clock, CreditCard, XCircle } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/src/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { Separator } from "@/src/components/ui/separator"
import { currentStudentFineRecord, GCASH_ACCOUNT_NAME, GCASH_ACCOUNT_NUMBER } from "./mock-data"
import { toast } from "sonner"

export default function PortalFinesPage() {
  const record = currentStudentFineRecord
  const fineItems = record?.fineItems ?? []

  // Fines that still need payment (not waived, bulk not yet approved)
  const unpaidItems = fineItems.filter(
    i => !i.isWaived && record?.bulkPaymentSubmission?.status !== "approved"
  )
  const unpaidTotal = unpaidItems.reduce((s, i) => s + i.amount, 0)
  const paidTotal = fineItems
    .filter(i => !i.isWaived && record?.bulkPaymentSubmission?.status === "approved")
    .reduce((s, i) => s + i.amount, 0)

  const hasPendingSubmission = record?.bulkPaymentSubmission?.status === "pending"
  const hasDeclinedSubmission = record?.bulkPaymentSubmission?.status === "declined"

  const [paymentOpen, setPaymentOpen] = useState(false)
  const [referenceCode, setReferenceCode] = useState("")
  const [receiptFile, setReceiptFile] = useState<File | null>(null)

  function handlePaymentSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!referenceCode || !receiptFile) {
      toast.error("Please fill in all required fields")
      return
    }
    toast.success("Bulk payment submitted for review")
    setPaymentOpen(false)
    setReferenceCode("")
    setReceiptFile(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Fines</h1>
        <p className="text-sm text-muted-foreground">View your fines and end-of-semester bulk payment status</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="size-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">&#8369;{unpaidTotal.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Outstanding balance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">&#8369;{paidTotal.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total paid</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <AlertTriangle className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{fineItems.length}</p>
                <p className="text-xs text-muted-foreground">Total fine item(s)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk payment status banner */}
      {record?.bulkPaymentSubmission && (
        <div className={[
          "flex items-start gap-3 rounded-md border px-4 py-3",
          hasPendingSubmission ? "border-border bg-muted/30" :
          hasDeclinedSubmission ? "border-destructive/40 bg-destructive/5" :
          "border-green-500/40 bg-green-500/5",
        ].join(" ")}>
          {hasPendingSubmission && <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />}
          {hasDeclinedSubmission && <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />}
          {!hasPendingSubmission && !hasDeclinedSubmission && <CheckCircle className="mt-0.5 size-4 shrink-0 text-green-600" />}
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">
              {hasPendingSubmission && "Bulk payment submitted \u2014 awaiting admin review"}
              {hasDeclinedSubmission && "Bulk payment was declined"}
              {!hasPendingSubmission && !hasDeclinedSubmission && "Bulk payment approved \u2014 all fines cleared"}
            </p>
            {hasDeclinedSubmission && record.bulkPaymentSubmission.rejectionReason && (
              <p className="text-xs text-destructive">
                Reason: {record.bulkPaymentSubmission.rejectionReason}
              </p>
            )}
            {hasPendingSubmission && (
              <p className="text-xs text-muted-foreground">
                Ref: {record.bulkPaymentSubmission.gcashReferenceNumber} &middot; Submitted {record.bulkPaymentSubmission.dateOfPayment}
              </p>
            )}
            {hasDeclinedSubmission && (
              <Button size="sm" className="mt-1 w-fit" onClick={() => setPaymentOpen(true)}>
                Resubmit Payment
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Fines Table */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base text-foreground">Fine History</CardTitle>
              <CardDescription className="text-muted-foreground">All fines associated with your account</CardDescription>
            </div>
            {unpaidItems.length > 0 && !hasPendingSubmission && record?.bulkPaymentSubmission?.status !== "approved" && (
              <Button onClick={() => setPaymentOpen(true)}>
                <CreditCard className="size-4" />
                Pay All Outstanding (&#8369;{unpaidTotal.toLocaleString()})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {fineItems.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Fine Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date Issued</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fineItems.map(item => {
                    const itemStatus = item.isWaived ? "waived"
                      : record?.bulkPaymentSubmission?.status === "approved" ? "paid"
                      : "unpaid"
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="text-sm text-muted-foreground">{item.itemNumber}</TableCell>
                        <TableCell className="text-sm text-foreground">{item.fineTypeName}</TableCell>
                        <TableCell className="max-w-56 text-sm text-foreground">{item.reason}</TableCell>
                        <TableCell className="text-right text-sm font-medium text-foreground">&#8369;{item.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.issuedAt}</TableCell>
                        <TableCell>
                          <Badge
                            variant={itemStatus === "paid" ? "secondary" : itemStatus === "waived" ? "outline" : "destructive"}
                            className="capitalize"
                          >
                            {itemStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle className="size-6 text-green-600" />
              </div>
              <h3 className="mt-3 text-sm font-medium text-foreground">No fines</h3>
              <p className="mt-1 text-xs text-muted-foreground">You have no fines on record. Keep it up!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Payment Modal */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Bulk Payment for All Fines</DialogTitle>
            <DialogDescription>
              Pay all outstanding fines in one GCash transaction and upload your receipt for admin review.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
            {/* Fine items being paid */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fine Items Covered</p>
              <div className="divide-y divide-border rounded-md border border-border">
                {unpaidItems.map(i => (
                  <div key={i.id} className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm">{i.fineTypeName}{i.eventName ? ` \u2014 ${i.eventName}` : ""}</span>
                    <span className="text-sm font-medium">&#8369;{i.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between bg-muted/30 px-3 py-2">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-sm font-semibold">&#8369;{unpaidTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-4">
              {/* GCash account info */}
              <div className="flex flex-col gap-2">
                <Label>Pay via GCash</Label>
                <div className="flex flex-col items-center rounded-lg border border-border bg-muted/30 p-4 text-center">
                  <div className="flex size-32 items-center justify-center rounded-md bg-background text-xs text-muted-foreground">
                    QR Code Placeholder
                  </div>
                  <p className="mt-3 text-sm font-medium">{GCASH_ACCOUNT_NAME}</p>
                  <p className="text-xs text-muted-foreground">{GCASH_ACCOUNT_NUMBER}</p>
                </div>
              </div>

              {/* Submission fields */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="referenceCode">GCash Reference Code *</Label>
                  <Input
                    id="referenceCode"
                    value={referenceCode}
                    onChange={e => setReferenceCode(e.target.value)}
                    placeholder="e.g., GC-2024-11-150001"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="receipt">Upload GCash Receipt *</Label>
                  <Input
                    id="receipt"
                    type="file"
                    accept="image/*"
                    onChange={e => setReceiptFile(e.target.files?.[0] ?? null)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Upload a clear screenshot of your GCash receipt</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPaymentOpen(false)}>Cancel</Button>
              <Button type="submit">Submit Payment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
