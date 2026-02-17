"use client"

import { AlertTriangle, CreditCard } from "lucide-react"
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
import { currentStudentFines, GCASH_QR_CODE, GCASH_ACCOUNT_NAME, GCASH_ACCOUNT_NUMBER } from "./mock-data"
import type { Fine, FineStatus } from "./types"
import { toast } from "sonner"
import Image from "next/image"

const statusVariant: Record<FineStatus, "destructive" | "secondary" | "outline"> = {
  unpaid: "destructive",
  paid: "secondary",
  waived: "outline",
}

export default function PortalFinesPage() {
  // Show all fines for the current student (Maria Santos - ID 2024-00101)
  // Maria has no fines in mock data, so let's show a broader view
  const myFines = currentStudentFines
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [selectedFine, setSelectedFine] = useState<Fine | null>(null)
  const [referenceCode, setReferenceCode] = useState("")
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [amount, setAmount] = useState("")

  const unpaidAmount = myFines.filter(f => f.status === "unpaid").reduce((s, f) => s + f.amount, 0)
  const paidAmount = myFines.filter(f => f.status === "paid").reduce((s, f) => s + f.amount, 0)

  function openPaymentModal(fine: Fine) {
    setSelectedFine(fine)
    setAmount(fine.amount.toString())
    setPaymentOpen(true)
  }

  function handlePaymentSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!referenceCode || !receiptFile || !amount) {
      toast.error("Please fill in all fields")
      return
    }
    // In a real app, this would upload to the server
    toast.success("Payment submitted for review")
    setPaymentOpen(false)
    setReferenceCode("")
    setReceiptFile(null)
    setAmount("")
    setSelectedFine(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Fines</h1>
        <p className="text-sm text-muted-foreground">View your fines and payment history</p>
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
                <p className="text-2xl font-bold text-foreground">P{unpaidAmount}</p>
                <p className="text-xs text-muted-foreground">Unpaid fines</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-success/10">
                <AlertTriangle className="size-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">P{paidAmount}</p>
                <p className="text-xs text-muted-foreground">Paid fines</p>
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
                <p className="text-2xl font-bold text-foreground">{myFines.length}</p>
                <p className="text-xs text-muted-foreground">Total fines</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fines Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base text-foreground">Fine History</CardTitle>
          <CardDescription className="text-muted-foreground">All fines associated with your account</CardDescription>
        </CardHeader>
        <CardContent>
          {myFines.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Issued</TableHead>
                    <TableHead>Date Paid</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myFines.map(fine => (
                    <TableRow key={fine.id}>
                      <TableCell className="text-sm text-foreground">{fine.reason}</TableCell>
                      <TableCell className="text-right text-sm font-medium text-foreground">₱{fine.amount}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[fine.status]} className="capitalize">{fine.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{fine.dateIssued}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{fine.datePaid || "--"}</TableCell>
                      <TableCell>
                        {fine.status === "unpaid" && (
                          <Button size="sm" variant="default" onClick={() => openPaymentModal(fine)}>
                            <CreditCard className="size-4 mr-1" /> Pay Now
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-success/10">
                <AlertTriangle className="size-6 text-success" />
              </div>
              <h3 className="mt-3 text-sm font-medium text-foreground">No fines</h3>
              <p className="mt-1 text-xs text-muted-foreground">You have no fines on record. Keep it up!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Payment for Fine</DialogTitle>
            <DialogDescription>Pay via GCash and submit proof of payment</DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
            {selectedFine && (
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm font-medium mb-1">Fine Details:</p>
                <p className="text-sm text-muted-foreground">{selectedFine.reason}</p>
                <p className="text-lg font-bold mt-2">Amount: ₱{selectedFine.amount}</p>
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
