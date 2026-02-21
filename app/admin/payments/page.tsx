"use client"

import { useState } from "react"
import { Search, CheckCircle, XCircle, Clock, Eye } from "lucide-react"
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
import { payments as initialPayments } from "./mock-data"
import type { Payment, PaymentStatus } from "./types"
import { toast } from "sonner"
import { StatCard } from "@/components/stat-card"

const statusVariant: Record<PaymentStatus, "default" | "secondary" | "destructive"> = {
  pending: "default",
  approved: "secondary",
  declined: "destructive",
}

const typeLabels: Record<string, string> = {
  "membership-fee": "Membership Fee",
  "fine": "Fine",
  "bulk": "Bulk Payment",
}

export default function PaymentsPage() {
  const [paymentsList, setPaymentsList] = useState<Payment[]>(initialPayments)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [remarks, setRemarks] = useState("")

  const filtered = paymentsList.filter(p => {
    const matchesSearch = p.studentName.toLowerCase().includes(search.toLowerCase()) ||
      p.referenceCode.toLowerCase().includes(search.toLowerCase()) ||
      p.studentId.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === "all" || p.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalPending = paymentsList.filter(p => p.status === "pending").length
  const totalApproved = paymentsList.filter(p => p.status === "approved").length
  const totalDeclined = paymentsList.filter(p => p.status === "declined").length

  function handleApprove(id: string) {
    setPaymentsList(prev =>
      prev.map(p => p.id === id ? { 
        ...p, 
        status: "approved" as PaymentStatus, 
        reviewedDate: new Date().toISOString().split("T")[0],
        reviewedBy: "Admin"
      } : p)
    )
    toast.success("Payment approved successfully")
    setReviewOpen(false)
    setSelectedPayment(null)
  }

  function handleDecline(id: string, remarks: string) {
    if (!remarks.trim()) {
      toast.error("Please provide remarks for declining")
      return
    }
    setPaymentsList(prev =>
      prev.map(p => p.id === id ? { 
        ...p, 
        status: "declined" as PaymentStatus, 
        reviewedDate: new Date().toISOString().split("T")[0],
        reviewedBy: "Admin",
        remarks
      } : p)
    )
    toast.success("Payment declined with remarks")
    setReviewOpen(false)
    setSelectedPayment(null)
    setRemarks("")
  }

  function openReview(payment: Payment) {
    setSelectedPayment(payment)
    setRemarks(payment.remarks || "")
    setReviewOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Payment Submissions</h1>
        <p className="text-sm text-muted-foreground">Review and manage student payment submissions</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Pending Review" value={totalPending.toString()} description="Awaiting approval" icon={Clock} />
        <StatCard title="Approved" value={totalApproved.toString()} description="Successfully approved" icon={CheckCircle} />
        <StatCard title="Declined" value={totalDeclined.toString()} description="Rejected submissions" icon={XCircle} />
      </div>

      {/* Table Card */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base text-foreground">All Payment Submissions</CardTitle>
              <CardDescription className="text-muted-foreground">{filtered.length} records found</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input placeholder="Search student or reference..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 w-64" />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead>Student</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reference Code</TableHead>
                <TableHead>Submitted</TableHead>
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
                filtered.map(payment => (
                  <TableRow key={payment.id} className="border-border">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{payment.studentName}</span>
                        <span className="text-xs text-muted-foreground">{payment.studentId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{typeLabels[payment.type]}</TableCell>
                    <TableCell className="text-sm font-medium text-foreground">₱{payment.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-sm font-mono text-foreground">{payment.referenceCode}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(payment.submittedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[payment.status]} className="capitalize">
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openReview(payment)}>
                          <Eye className="size-4" />
                        </Button>
                        {payment.status === "pending" && (
                          <>
                            <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950" onClick={() => handleApprove(payment.id)}>
                              <CheckCircle className="size-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950" onClick={() => openReview(payment)}>
                              <XCircle className="size-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Payment Submission</DialogTitle>
            <DialogDescription>Review the payment details and receipt</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Student</Label>
                  <p className="text-sm font-medium">{selectedPayment.studentName}</p>
                  <p className="text-xs text-muted-foreground">{selectedPayment.studentId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="text-sm font-medium">{typeLabels[selectedPayment.type]}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Amount</Label>
                  <p className="text-sm font-medium">₱{selectedPayment.amount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Reference Code</Label>
                  <p className="text-sm font-mono">{selectedPayment.referenceCode}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Submitted Date</Label>
                  <p className="text-sm">{new Date(selectedPayment.submittedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge variant={statusVariant[selectedPayment.status]} className="capitalize">
                    {selectedPayment.status}
                  </Badge>
                </div>
              </div>

              {/* Line items breakdown for bulk payments */}
              {selectedPayment.type === "bulk" && selectedPayment.lineItems && selectedPayment.lineItems.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Items Covered</Label>
                  <div className="mt-2 divide-y divide-border rounded-md border border-border">
                    {selectedPayment.lineItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-2">
                        <div className="flex flex-col">
                          <span className="text-sm">{item.name}</span>
                          <span className="text-xs capitalize text-muted-foreground">{item.type}</span>
                        </div>
                        <span className="text-sm font-medium">₱{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between bg-muted/30 px-3 py-2">
                      <span className="text-sm font-semibold">Total</span>
                      <span className="text-sm font-semibold">
                        ₱{selectedPayment.lineItems.reduce((s, i) => s + i.amount, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-muted-foreground">GCash Receipt</Label>
                <div className="mt-2 rounded-lg border border-border p-4 bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-2">Receipt preview would be displayed here</p>
                  <div className="bg-background rounded border border-border p-2 text-center text-sm text-muted-foreground">
                    {selectedPayment.receiptImage}
                  </div>
                </div>
              </div>

              {selectedPayment.status === "pending" && (
                <div>
                  <Label htmlFor="remarks">Remarks (Required for declining)</Label>
                  <Textarea
                    id="remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter remarks if declining this payment..."
                    className="mt-2"
                    rows={3}
                  />
                </div>
              )}

              {selectedPayment.status === "declined" && selectedPayment.remarks && (
                <div>
                  <Label className="text-muted-foreground">Decline Remarks</Label>
                  <p className="text-sm mt-1 p-3 rounded-md bg-destructive/10 text-destructive">
                    {selectedPayment.remarks}
                  </p>
                </div>
              )}

              {selectedPayment.reviewedDate && (
                <div className="text-xs text-muted-foreground">
                  Reviewed on {new Date(selectedPayment.reviewedDate).toLocaleDateString()} by {selectedPayment.reviewedBy}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedPayment?.status === "pending" && (
              <>
                <Button variant="outline" onClick={() => setReviewOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => selectedPayment && handleDecline(selectedPayment.id, remarks)}>
                  Decline
                </Button>
                <Button onClick={() => selectedPayment && handleApprove(selectedPayment.id)}>
                  Approve
                </Button>
              </>
            )}
            {selectedPayment?.status !== "pending" && (
              <Button onClick={() => setReviewOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
