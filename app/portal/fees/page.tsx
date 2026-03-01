"use client"

import { Banknote, Check, Clock, X, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/PageHeader"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Separator } from "@/src/components/ui/separator"
import {
  currentStudentFees,
  currentStudentPaymentLogs,
  currentStudent,
} from "./mock-data"
import { cn } from "@/src/lib/utils"
import type { FeeType } from "./types"
import { DataPagination } from "@/components/DataPagination"

const ITEMS_PER_PAGE = 10

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
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(currentStudentFees.length / ITEMS_PER_PAGE)
  const paginatedFees = currentStudentFees.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Fees"
        context="2nd Semester · A.Y. 2025–2026"
        description="Your USSC fee records and payment history"
      />

      {/* Student Info Card */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                {currentStudent.firstName} {currentStudent.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentStudent.studentId} &mdash; {currentStudent.program}
              </p>
            </div>
            <Badge variant="secondary" className="w-fit">Active Member</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Fee Records */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Fee History</h3>
        {paginatedFees.map(fee => {
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

                  {/* Rejected — show reason */}
                  {studentStatus === "rejected" && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs font-medium text-destructive mb-0.5">Payment Rejected</p>
                        {log?.rejectionReason && (
                          <p className="text-xs text-muted-foreground">{log.rejectionReason}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Head to the Clearance page to resubmit payment.</p>
                      </div>
                    </>
                  )}

                  {/* Unpaid — direct to clearance */}
                  {studentStatus === "unpaid" && (
                    <>
                      <Separator />
                      <p className="text-xs text-muted-foreground">
                        Payment required. Head to the Clearance page to submit payment.
                      </p>
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
        <DataPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={currentStudentFees.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

    </div>
  )
}

