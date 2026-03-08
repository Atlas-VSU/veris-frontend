"use client"

import { Banknote, Check, Clock, X, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
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
import { DataPagination } from "@/components/shared/DataPagination"

const ITEMS_PER_PAGE = 10

type StudentFeeStatus = "paid" | "pending" | "rejected" | "unpaid"

const feeTypeLabels: Record<FeeType, string> = {
  "semestral-membership": "Semestral Membership",
  "organization-fee":   "Organization Fee",
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
    <div className="flex flex-col gap-5 sm:gap-6">
      <PageHeader
        variant="portal"
        title="Fees"
        context="2nd Semester · A.Y. 2025–2026"
        description="Your USSC and organizational fee records and payment history"
      />

      {/* Student Info Card */}
      {/* <Card className="border-[#E0E0E0] bg-[#1B5E20]/2 shadow-sm">
        <CardContent className="p-3 sm:pt-6 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold text-foreground sm:text-sm">
                {currentStudent.firstName} {currentStudent.lastName}
              </p>
              <p className="text-[10px] text-muted-foreground sm:text-xs">
                {currentStudent.studentId} &mdash; {currentStudent.program}
              </p>
            </div>
            <Badge variant="secondary" className="w-fit text-[10px] sm:text-xs">Active Member</Badge>
          </div>
        </CardContent>
      </Card> */}

      {/* Fee Records */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">Fee History</h3> */}
        {paginatedFees.map(fee => {
          const studentStatus = getStudentStatus(fee.id)
          const config = statusConfig[studentStatus]
          const Icon = config.icon
          const log = currentStudentPaymentLogs.find(l => l.feeId === fee.id)

          return (
            <Card key={fee.id} className="border-[#E0E0E0] bg-white shadow-sm transition-colors duration-150 hover:border-[#1B5E20]/30">
              <CardContent className="p-3 sm:pt-6 sm:px-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0 sm:gap-3">
                      <div className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full sm:size-10",
                        studentStatus === "paid"    ? "bg-[#8BC34A]/10"   :
                        studentStatus === "pending" ? "bg-[#1B5E20]/10"      :
                                                      "bg-destructive/10"
                      )}>
                        <Banknote className={cn("size-4 sm:size-5", config.iconColor)} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground wrap-break-word sm:text-sm">{fee.title}</p>
                        <p className="text-[10px] text-muted-foreground sm:text-xs">
                          {feeTypeLabels[fee.type]} · {fee.semester} {fee.academicYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-sm font-bold text-foreground whitespace-nowrap sm:text-lg">₱{fee.amount.toLocaleString()}</span>
                      <Badge variant={config.variant} className="flex items-center gap-1 capitalize text-[10px] whitespace-nowrap sm:text-xs">
                        <Icon className="size-3" />
                        {config.label}
                      </Badge>
                    </div>
                  </div>

                  {studentStatus === "paid" && log && (
                    <>
                      <Separator />
                      <div className="flex flex-col gap-0.5 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:gap-4 sm:text-xs">
                        <span>Paid: {log.paidAt}</span>
                        <span>Method: {log.paymentMethod === "gcash" ? "GCash" : log.paymentMethod}</span>
                        {log.gcashReferenceNumber && (
                          <span className="font-mono">Ref: {log.gcashReferenceNumber}</span>
                        )}
                      </div>
                    </>
                  )}

                  {studentStatus === "pending" && (
                    <>
                      <Separator />
                      <p className="text-[10px] text-muted-foreground sm:text-xs">
                        Your payment is under review. You will be notified once it is verified.
                      </p>
                    </>
                  )}

                  {studentStatus === "rejected" && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-[10px] font-medium text-destructive mb-0.5 sm:text-xs">Payment Rejected</p>
                        {log?.rejectionReason && (
                          <p className="text-[10px] text-muted-foreground sm:text-xs">{log.rejectionReason}</p>
                        )}
                        <p className="text-[10px] text-muted-foreground mt-1 sm:text-xs">Head to the Clearance page to resubmit payment.</p>
                      </div>
                    </>
                  )}

                  {/* Unpaid — direct to clearance */}
                  {studentStatus === "unpaid" && (
                    <>
                      <Separator />
                      <p className="text-[10px] text-muted-foreground sm:text-xs">
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
          <div className="flex flex-col items-center justify-center py-8 text-center sm:py-12">
            <Banknote className="size-8 text-muted-foreground sm:size-12" />
            <h3 className="mt-3 text-xs font-medium text-foreground sm:text-sm">No fee records</h3>
            <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">No fee records have been issued yet.</p>
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

