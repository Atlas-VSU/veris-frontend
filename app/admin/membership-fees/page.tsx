"use client"

import { useState } from "react"
import { Banknote, Download } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { PageHeader } from "@/components/PageHeader"
import { SearchInput } from "@/components/SearchInput"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/src/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/src/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/src/components/ui/select"
import { membershipFees as initialFees } from "./mock-data"
import type { MembershipFee, FeeStatus } from "./types"
import { toast } from "sonner"
import { StatCard } from "@/components/StatCard"
import { DataPagination } from "@/components/DataPagination"
import { CircleDollarSign, AlertTriangle } from "lucide-react"

const ITEMS_PER_PAGE = 10

const statusVariant: Record<FeeStatus, "secondary" | "destructive" | "outline"> = {
  paid: "secondary",
  unpaid: "destructive",
  partial: "outline",
}

export default function MembershipFeesPage() {
  const [fees, setFees] = useState<MembershipFee[]>(initialFees)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [logOpen, setLogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = fees.filter(f => {
    const matchesSearch = f.studentName.toLowerCase().includes(search.toLowerCase()) || f.studentId.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === "all" || f.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const totalPaid = fees.filter(f => f.status === "paid")
  const totalCollected = totalPaid.reduce((s, f) => s + f.amount, 0)
  const totalUnpaid = fees.filter(f => f.status === "unpaid").length
  const totalPartial = fees.filter(f => f.status === "partial").length

  function handleMarkPaid(fee: MembershipFee) {
    const receiptNo = `USSC-2024-${String(fees.filter(f => f.receiptNo).length + 1).padStart(4, "0")}`
    setFees(prev =>
      prev.map(f => f.id === fee.id
        ? { ...f, status: "paid" as FeeStatus, paidDate: new Date().toISOString().split("T")[0], receiptNo }
        : f
      )
    )
    toast.success(`Payment recorded. Receipt: ${receiptNo}`)
  }

  // Payment log dialog
  const paidFees = fees.filter(f => f.status === "paid" && f.paidDate).sort((a, b) => (b.paidDate || "").localeCompare(a.paidDate || ""))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Membership Fees"
        context="2nd Semester · A.Y. 2025–2026"
        description="Collection and tracking of student membership fees"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Collected" value={`P${totalCollected.toLocaleString()}`} description={`${totalPaid.length} students paid`} icon={Banknote} />
        <StatCard title="Unpaid" value={totalUnpaid} description="Students haven't paid" icon={AlertTriangle} />
        <StatCard title="Partial Payments" value={totalPartial} description="Incomplete payments" icon={CircleDollarSign} />
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base text-foreground">Fee Collection</CardTitle>
              <CardDescription className="text-muted-foreground">2nd Semester A.Y. 2025-2026 -- P150.00 per student</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SearchInput
                placeholder="Search student..."
                value={search}
                onChange={v => { setSearch(v); setCurrentPage(1) }}
                className="w-56"
              />
              <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={logOpen} onOpenChange={setLogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Banknote className="size-4" /> Payment Log
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Payment Log</DialogTitle>
                    <DialogDescription>History of all recorded payments</DialogDescription>
                  </DialogHeader>
                  <div className="max-h-80 overflow-y-auto">
                    <div className="flex flex-col gap-2">
                      {paidFees.map(f => (
                        <div key={f.id} className="flex items-center justify-between rounded-md border border-border p-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-foreground">{f.studentName}</span>
                            <span className="text-xs text-muted-foreground">{f.paidDate} -- Receipt: {f.receiptNo}</span>
                          </div>
                          <span className="text-sm font-semibold text-foreground">P{f.amount}</span>
                        </div>
                      ))}
                      {paidFees.length === 0 && (
                        <p className="py-8 text-center text-sm text-muted-foreground">No payments recorded.</p>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Export started (mock)")}>
                <Download className="size-4" /> Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead>Receipt No.</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map(fee => (
                  <TableRow key={fee.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{fee.studentName}</span>
                        <span className="text-xs text-muted-foreground">{fee.studentId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{fee.semester}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{fee.academicYear}</TableCell>
                    <TableCell className="text-right text-sm font-medium text-foreground">P{fee.amount}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[fee.status]} className="capitalize">{fee.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{fee.paidDate || "--"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">{fee.receiptNo || "--"}</TableCell>
                    <TableCell className="text-right">
                      {fee.status !== "paid" && (
                        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleMarkPaid(fee)}><Banknote className="size-3.5" /> Record Payment</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">No fee records found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DataPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  )
}
