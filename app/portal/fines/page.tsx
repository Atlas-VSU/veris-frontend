"use client"

import { AlertTriangle, CheckCircle, Clock, FileText, MessageSquareWarning, RotateCcw, XCircle } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/PageHeader"
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
import { DataPagination } from "@/components/DataPagination"
import { currentStudentFineRecord } from "./mock-data"
import { cn } from "@/src/lib/utils"
import type { FineItem } from "@/app/admin/fines/types"
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
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Fines"
        context="2nd Semester · A.Y. 2025–2026"
        description="View your fines and submit appeals for review"
      />

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
                <p className="text-2xl font-bold text-foreground">&#8369;{clearedTotal.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Cleared / waived</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <FileText className="size-5 text-primary" />
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
        <div className={cn(
          "flex items-start gap-3 rounded-md border px-4 py-3",
          hasPendingSubmission ? "border-border bg-muted/30" :
          hasDeclinedSubmission ? "border-destructive/40 bg-destructive/5" :
          "border-green-500/40 bg-green-500/5",
        )}>
          {hasPendingSubmission  && <Clock    className="mt-0.5 size-4 shrink-0 text-muted-foreground" />}
          {hasDeclinedSubmission && <XCircle  className="mt-0.5 size-4 shrink-0 text-destructive" />}
          {bulkApproved          && <CheckCircle className="mt-0.5 size-4 shrink-0 text-green-600" />}
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">
              {hasPendingSubmission  && "Bulk payment submitted — awaiting admin review"}
              {hasDeclinedSubmission && "Bulk payment was declined"}
              {bulkApproved          && "Bulk payment approved — all fines cleared"}
            </p>
            {hasDeclinedSubmission && record.bulkPaymentSubmission.rejectionReason && (
              <p className="text-xs text-destructive">Reason: {record.bulkPaymentSubmission.rejectionReason}</p>
            )}
            {hasPendingSubmission && (
              <p className="text-xs text-muted-foreground">
                Ref: {record.bulkPaymentSubmission.gcashReferenceNumber} &middot; Submitted {record.bulkPaymentSubmission.dateOfPayment}
              </p>
            )}
            {hasDeclinedSubmission && (
              <p className="text-xs text-destructive mt-1">Head to the Clearance page to resubmit payment.</p>
            )}
          </div>
        </div>
      )}

      {/* Fines Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base text-foreground">Fine History</CardTitle>
          <CardDescription className="text-muted-foreground">
            All fines associated with your account. Use the Appeal button to dispute a fine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {fineItems.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">#</TableHead>
                    <TableHead>Fine</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date Issued</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Appeal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map(item => {
                    const effectiveStatus = getEffectiveStatus(item, bulkApproved)
                    const appeal = item.appeal

                    return (
                      <TableRow key={item.id}>
                        {/* # */}
                        <TableCell className="text-sm text-muted-foreground">{item.itemNumber}</TableCell>

                        {/* Fine name + reason */}
                        <TableCell>
                          <p className="text-sm font-medium text-foreground">
                            {item.fineTypeName}
                            {item.eventName && (
                              <span className="ml-1 font-normal text-muted-foreground">— {item.eventName}</span>
                            )}
                          </p>
                          <p className="mt-0.5 w-48 truncate text-xs text-muted-foreground" title={item.reason}>{item.reason}</p>
                        </TableCell>

                        {/* Amount */}
                        <TableCell className="text-right text-sm font-medium text-foreground">
                          &#8369;{item.amount.toLocaleString()}
                        </TableCell>

                        {/* Date issued */}
                        <TableCell className="text-sm text-muted-foreground">{item.issuedAt}</TableCell>

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
                            <Badge variant="secondary" className="border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400">
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

      {/* Appeal Dialog */}
      <Dialog open={!!appealItem} onOpenChange={open => { if (!open) setAppealItem(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {appealItem?.appeal?.status === "rejected" ? "Re-submit Appeal" : "Submit Appeal"}
            </DialogTitle>
            <DialogDescription>
              Provide a clear explanation for your appeal. Attach supporting documents if available.
            </DialogDescription>
          </DialogHeader>

          {appealItem && (
            <form onSubmit={handleAppealSubmit} className="flex flex-col gap-4">
              {/* Fine summary */}
              <div className="rounded-lg border border-border bg-muted/40 px-4 py-3">
                <p className="text-sm font-medium text-foreground">
                  {appealItem.fineTypeName}
                  {appealItem.eventName && (
                    <span className="ml-1 font-normal text-muted-foreground">— {appealItem.eventName}</span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{appealItem.reason}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
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

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAppealItem(null)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Appeal</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
