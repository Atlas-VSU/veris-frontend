"use client"

import { AlertTriangle, CheckCircle, Clock, FileText, MessageSquareWarning, RotateCcw, XCircle } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
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
import { Textarea } from "@/src/components/ui/textarea"
import { Input } from "@/src/components/ui/input"
import { Separator } from "@/src/components/ui/separator"
import { DataPagination } from "@/components/shared/DataPagination"
import { currentStudentFineRecord } from "./mock-data"
import { cn } from "@/src/lib/utils"
import type { FineItem } from "@/src/features/admin/fines/types"
import { toast } from "sonner"

const ITEMS_PER_PAGE = 10

type EffectiveStatus = "paid" | "waived" | "appeal-approved" | "unpaid"

function getEffectiveStatus(item: FineItem, bulkApproved: boolean): EffectiveStatus {
  if (bulkApproved && !item.isWaived) return "paid"
  if (item.isWaived) return "waived"
  if (item.appeal?.status === "approved") return "appeal-approved"
  return "unpaid"
}

export default function PortalFinesPage() {
  const record = currentStudentFineRecord
  const fineItems = record?.fineItems ?? []
  const bulkApproved = record?.bulkPaymentSubmission?.status === "approved"

  const unpaidItems = fineItems.filter(i => !i.isWaived && !bulkApproved && i.appeal?.status !== "approved")
  const unpaidTotal = unpaidItems.reduce((s, i) => s + i.amount, 0)
  const clearedTotal = fineItems
    .filter(i => i.isWaived || bulkApproved || i.appeal?.status === "approved")
    .reduce((s, i) => s + i.amount, 0)

  const hasPendingSubmission = record?.bulkPaymentSubmission?.status === "pending"
  const hasDeclinedSubmission = record?.bulkPaymentSubmission?.status === "declined"

  const [currentPage, setCurrentPage] = useState(1)
  const [appealItem, setAppealItem] = useState<FineItem | null>(null)
  const [appealMessage, setAppealMessage] = useState("")

  const totalPages = Math.ceil(fineItems.length / ITEMS_PER_PAGE)
  const paginatedItems = fineItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  function openAppeal(item: FineItem) {
    setAppealItem(item)
    setAppealMessage("")
  }

  function handleAppealSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!appealMessage.trim()) {
      toast.error("Please write an appeal message.")
      return
    }
    toast.success("Appeal submitted. You will be notified once the admin reviews it.")
    setAppealItem(null)
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <PageHeader
        variant="portal"
        title="My Fines"
        context="2nd Semester · A.Y. 2025–2026"
        description="View your fines and submit appeals for review"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card className="border-[#E0E0E0] bg-white shadow-sm transition-all duration-200 hover:shadow-md">
          <CardContent className="p-3 sm:pt-6 sm:px-6">
            <div className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 sm:size-10">
                <AlertTriangle className="size-4 text-destructive sm:size-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground sm:text-2xl">&#8369;{unpaidTotal.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground sm:text-xs">Outstanding balance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#E0E0E0] bg-white shadow-sm transition-all duration-200 hover:shadow-md">
          <CardContent className="p-3 sm:pt-6 sm:px-6">
            <div className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#8BC34A]/10 sm:size-10">
                <CheckCircle className="size-4 text-[#8BC34A] sm:size-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground sm:text-2xl">&#8369;{clearedTotal.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground sm:text-xs">Cleared / waived</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#E0E0E0] bg-white shadow-sm transition-all duration-200 hover:shadow-md">
          <CardContent className="p-3 sm:pt-6 sm:px-6">
            <div className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1B5E20]/10 sm:size-10">
                <FileText className="size-4 text-[#1B5E20] sm:size-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground sm:text-2xl">{fineItems.length}</p>
                <p className="text-[10px] text-muted-foreground sm:text-xs">Total fine item(s)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk payment status banner */}
      {record?.bulkPaymentSubmission && (
        <div className={cn(
          "flex items-start gap-2 rounded-md border px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3",
          hasPendingSubmission ? "border-[#1B5E20]/20 bg-[#1B5E20]/2" :
          hasDeclinedSubmission ? "border-destructive/40 bg-destructive/5" :
          "border-[#8BC34A]/40 bg-[#8BC34A]/5",
        )}>
          {hasPendingSubmission  && <Clock    className="mt-0.5 size-4 shrink-0 text-muted-foreground" />}
          {hasDeclinedSubmission && <XCircle  className="mt-0.5 size-4 shrink-0 text-destructive" />}
          {bulkApproved          && <CheckCircle className="mt-0.5 size-4 shrink-0 text-[#8BC34A]" />}
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-medium sm:text-sm">
              {hasPendingSubmission  && "Bulk payment submitted — awaiting admin review"}
              {hasDeclinedSubmission && "Bulk payment was declined"}
              {bulkApproved          && "Bulk payment approved — all fines cleared"}
            </p>
            {hasDeclinedSubmission && record.bulkPaymentSubmission.rejectionReason && (
              <p className="text-[10px] text-destructive sm:text-xs">Reason: {record.bulkPaymentSubmission.rejectionReason}</p>
            )}
            {hasPendingSubmission && (
              <p className="text-[10px] text-muted-foreground sm:text-xs">
                Ref: {record.bulkPaymentSubmission.gcashReferenceNumber} &middot; Submitted {record.bulkPaymentSubmission.dateOfPayment}
              </p>
            )}
            {hasDeclinedSubmission && (
              <p className="text-[10px] text-destructive mt-1 sm:text-xs">Head to the Clearance page to resubmit payment.</p>
            )}
          </div>
        </div>
      )}

      {/* Fines Table */}
      <Card className="border-[#E0E0E0] bg-white shadow-sm">
        <CardHeader className="px-3 pb-2 pt-4 sm:px-6 sm:pb-3 sm:pt-6">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">Fine History</CardTitle>
          <CardDescription className="text-[10px] text-[#1B5E20]/50 sm:text-xs">
            All fines associated with your account. Use the Appeal button to dispute a fine.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 pb-4 sm:px-6 sm:pb-6">
          {fineItems.length > 0 ? (
            <div className="-mx-3 overflow-x-auto sm:mx-0">
              <Table className="text-xs sm:text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8 whitespace-nowrap">#</TableHead>
                    <TableHead className="whitespace-nowrap">Fine</TableHead>
                    <TableHead className="whitespace-nowrap text-right">Amount</TableHead>
                    <TableHead className="hidden whitespace-nowrap sm:table-cell">Date Issued</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Appeal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map(item => {
                    const effectiveStatus = getEffectiveStatus(item, bulkApproved)
                    const appeal = item.appeal

                    return (
                      <TableRow key={item.id}>
                        {/* # */}
                        <TableCell className="text-muted-foreground">{item.itemNumber}</TableCell>

                        {/* Fine name + reason */}
                        <TableCell>
                          <p className="font-medium text-foreground">
                            {item.fineTypeName}
                            {item.eventName && (
                              <span className="ml-1 font-normal text-muted-foreground">— {item.eventName}</span>
                            )}
                          </p>
                          <p className="mt-0.5 max-w-30 truncate text-[10px] text-muted-foreground sm:max-w-48 sm:text-xs" title={item.reason}>{item.reason}</p>
                        </TableCell>

                        {/* Amount */}
                        <TableCell className="text-right font-medium text-foreground">
                          &#8369;{item.amount.toLocaleString()}
                        </TableCell>

                        {/* Date issued */}
                        <TableCell className="hidden text-muted-foreground sm:table-cell">{item.issuedAt}</TableCell>

                        {/* Status */}
                        <TableCell>
                          {effectiveStatus === "paid" && (
                            <Badge variant="secondary">Paid</Badge>
                          )}
                          {effectiveStatus === "waived" && (
                            <Badge variant="outline">
                              Waived
                            </Badge>
                          )}
                          {effectiveStatus === "appeal-approved" && (
                            <Badge variant="secondary" className="border-success/40 bg-success/10 text-success">
                              Appeal Approved
                            </Badge>
                          )}
                          {effectiveStatus === "unpaid" && (
                            <Badge variant="destructive">Unpaid</Badge>
                          )}
                        </TableCell>

                        {/* Appeal */}
                        <TableCell>
                          {/* Waived or appeal approved — nothing to dispute */}
                          {(effectiveStatus === "waived" || effectiveStatus === "appeal-approved" || effectiveStatus === "paid") && (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}

                          {/* Appeal pending */}
                          {effectiveStatus === "unpaid" && appeal?.status === "pending" && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Clock className="size-3.5 shrink-0" />
                              <span>Under Review</span>
                            </div>
                          )}

                          {/* Appeal rejected — show reason tooltip + re-appeal */}
                          {effectiveStatus === "unpaid" && appeal?.status === "rejected" && (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1 text-xs text-destructive">
                                <XCircle className="size-3.5 shrink-0" />
                                <span>Rejected</span>
                              </div>
                              {appeal.rejectionReason && (
                                <p className="w-40 truncate text-xs text-muted-foreground" title={appeal.rejectionReason}>
                                  {appeal.rejectionReason}
                                </p>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-1 h-7 gap-1 text-xs"
                                onClick={() => openAppeal(item)}
                              >
                                <RotateCcw className="size-3" />
                                Re-appeal
                              </Button>
                            </div>
                          )}

                          {/* No appeal yet — show appeal button */}
                          {effectiveStatus === "unpaid" && !appeal && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 gap-1 text-xs"
                              onClick={() => openAppeal(item)}
                            >
                              <MessageSquareWarning className="size-3.5" />
                              Appeal
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <DataPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={fineItems.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center sm:py-12">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#8BC34A]/10 sm:size-12">
                <CheckCircle className="size-5 text-[#8BC34A] sm:size-6" />
              </div>
              <h3 className="mt-3 text-xs font-medium text-foreground sm:text-sm">No fines</h3>
              <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">You have no fines on record. Keep it up!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appeal Dialog */}
      <Dialog open={!!appealItem} onOpenChange={open => { if (!open) setAppealItem(null) }}>
        <DialogContent className="max-h-[90vh] max-w-[95vw] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {appealItem?.appeal?.status === "rejected" ? "Re-submit Appeal" : "Submit Appeal"}
            </DialogTitle>
            <DialogDescription>
              Provide a clear explanation for your appeal. Attach supporting documents if available.
            </DialogDescription>
          </DialogHeader>

          {appealItem && (
            <form onSubmit={handleAppealSubmit} className="flex flex-col gap-3 sm:gap-4">
              {/* Fine summary */}
              <div className="rounded-lg border border-[#1B5E20]/10 bg-[#1B5E20]/2 px-3 py-2.5 sm:px-4 sm:py-3">
                <p className="text-xs font-medium text-foreground sm:text-sm">
                  {appealItem.fineTypeName}
                  {appealItem.eventName && (
                    <span className="ml-1 font-normal text-muted-foreground">— {appealItem.eventName}</span>
                  )}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">{appealItem.reason}</p>
                <div className="mt-2 flex flex-col gap-1 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:gap-3 sm:text-xs">
                  <span>Issued: {appealItem.issuedAt}</span>
                  <span className="font-semibold text-foreground">&#8369;{appealItem.amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Previous rejection reason */}
              {appealItem.appeal?.status === "rejected" && appealItem.appeal.rejectionReason && (
                <>
                  <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
                    <p className="text-xs font-medium text-destructive mb-0.5">Previous Appeal Rejected</p>
                    <p className="text-xs text-muted-foreground">{appealItem.appeal.rejectionReason}</p>
                  </div>
                </>
              )}

              <Separator />

              {/* Appeal message */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="appealMessage">
                  Appeal Message <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="appealMessage"
                  value={appealMessage}
                  onChange={e => setAppealMessage(e.target.value)}
                  placeholder="Explain why this fine should be waived or reconsidered. Be specific and include any relevant context."
                  rows={5}
                  required
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Be clear and specific. Vague appeals are less likely to be approved.
                </p>
              </div>

              {/* Supporting document */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="appealDoc">
                  Supporting Document <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="appealDoc"
                  type="file"
                  accept="image/*,.pdf"
                />
                <p className="text-xs text-muted-foreground">
                  Attach a photo or PDF — e.g. medical certificate, permit, or official letter.
                </p>
              </div>

              <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-0">
                <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setAppealItem(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="w-full bg-[#8BC34A] text-[#1B5E20] hover:bg-[#7CB342] font-semibold sm:w-auto">Submit Appeal</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
