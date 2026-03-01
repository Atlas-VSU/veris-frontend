"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { PageHeader } from "@/components/PageHeader"
import { SearchInput } from "@/components/SearchInput"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/src/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/src/components/ui/select"
import { payments as initialPayments } from "./mock-data"
import type { Payment, PaymentStatus } from "./types"
import { toast } from "sonner"
import { StatCard } from "@/components/StatCard"
import { DataPagination } from "@/components/DataPagination"
import { ViewToggle } from "@/components/ViewToggle"
import type { ViewMode } from "@/components/ViewToggle"
import { PaymentReviewDialog } from "@/components/PaymentReviewDialog"

const ITEMS_PER_PAGE = 10

const statusVariant: Record<PaymentStatus, "outline" | "secondary" | "destructive"> = {
  pending: "outline",
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
  const [currentPage, setCurrentPage] = useState(1)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("table")

  const filtered = paymentsList.filter(p => {
    const matchesSearch = p.studentName.toLowerCase().includes(search.toLowerCase()) ||
      p.referenceCode.toLowerCase().includes(search.toLowerCase()) ||
      p.studentId.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === "all" || p.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

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
    setSelectedPayment(null)
  }

  function handleDecline(id: string, reason: string) {
    setPaymentsList(prev =>
      prev.map(p => p.id === id ? { 
        ...p, 
        status: "declined" as PaymentStatus, 
        reviewedDate: new Date().toISOString().split("T")[0],
        reviewedBy: "Admin",
        remarks: reason
      } : p)
    )
    toast.success("Payment declined with remarks")
    setSelectedPayment(null)
  }

  function openReview(payment: Payment) {
    setSelectedPayment(payment)
    setReviewOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Payment Submissions"
        context="2nd Semester · A.Y. 2025–2026"
        description="Review and manage student payment submissions"
      />

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
              <SearchInput
                placeholder="Search student or reference..."
                value={search}
                onChange={v => { setSearch(v); setCurrentPage(1) }}
                className="w-64"
              />
              <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setCurrentPage(1) }}>
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
                  {paginated.map(payment => (
                    <Card key={payment.id} className="border-border flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-sm font-semibold">{payment.studentName}</CardTitle>
                            <CardDescription className="text-xs">{payment.studentId}</CardDescription>
                          </div>
                          <Badge variant={statusVariant[payment.status]} className="capitalize shrink-0">
                            {payment.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-2 pt-0 flex-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{typeLabels[payment.type]}</span>
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
                  ))}
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
                paginated.map(payment => (
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
                      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => openReview(payment)}>
                        <Eye className="size-3.5" /> View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
      </Card>

      {/* Review Dialog */}
      <PaymentReviewDialog
        open={reviewOpen}
        onOpenChange={open => { setReviewOpen(open); if (!open) setSelectedPayment(null) }}
        data={selectedPayment ? {
          studentName: selectedPayment.studentName,
          studentId: selectedPayment.studentId,
          typeLabel: typeLabels[selectedPayment.type],
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
    </div>
  )
}
