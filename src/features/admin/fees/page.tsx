"use client"

import { useState } from "react"
import { Plus, Zap, ChevronRight, CircleDollarSign, DollarSign, Users } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { PageHeader } from "@/components/shared/PageHeader"
import { SearchInput } from "@/components/shared/SearchInput"
import { ViewToggle } from "@/components/shared/ViewToggle"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
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
import { Progress } from "@/src/components/ui/progress"
import { fees as initialFees } from "./mock-data"
import type { Fee, FeeType } from "./types"
import { toast } from "sonner"
import { StatCard } from "@/components/shared/StatCard"
import { DataPagination } from "@/components/shared/DataPagination"
import { useRouter } from "next/navigation"

const ITEMS_PER_PAGE = 10

const feeTypeLabels: Record<FeeType, string> = {
  "semestral-membership": "Semestral Membership",
  "organization-fee": "Organization Dues",
}

const feeTypeVariant: Record<FeeType, "default" | "secondary" | "outline" | "destructive"> = {
  "semestral-membership": "default",
  "organization-fee": "destructive",
}

export default function FeesPage() {
  const router = useRouter()
  const [feesList, setFeesList] = useState<Fee[]>(initialFees)
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState<"card" | "table">("card")
  const [createOpen, setCreateOpen] = useState(false)
  const [generateOpen, setGenerateOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Create form state
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newType, setNewType] = useState<FeeType | "">("")
  const [newAmount, setNewAmount] = useState("")

  const filtered = feesList.filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    feeTypeLabels[f.type].toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const totalCollected = feesList.reduce((sum, f) => sum + f.paidCount * f.amount, 0)
  const avgCompletion = feesList.length > 0
    ? Math.round(feesList.reduce((sum, f) => sum + (f.totalStudents > 0 ? (f.paidCount / f.totalStudents) * 100 : 0), 0) / feesList.length)
    : 0

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle || !newType || !newAmount) {
      toast.error("Please fill in all required fields")
      return
    }
    const created: Fee = {
      id: `fee-${Date.now()}`,
      title: newTitle,
      description: newDescription || undefined,
      type: newType as FeeType,
      amount: parseFloat(newAmount),
      academicYear: "2025-2026",
      semester: "1st Semester",
      createdAt: new Date().toISOString().split("T")[0],
      totalStudents: 0,
      paidCount: 0,
    }
    setFeesList(prev => [created, ...prev])
    toast.success("Fee created successfully")
    setCreateOpen(false)
    setNewTitle(""); setNewDescription(""); setNewType(""); setNewAmount("")
  }

  function handleGenerate(feeId: string) {
    setFeesList(prev => prev.map(f => f.id === feeId ? { ...f, totalStudents: 20 } : f))
    toast.success("Fee generated for all registered members")
    setGenerateOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        variant="admin"
        title="Fees"
        context="2nd Semester · A.Y. 2025–2026"
        description="Management and tracking of Council/Organization Fees"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Fees" value={feesList.length} description="Active fee categories" icon={CircleDollarSign} />
        <StatCard title="Total Collected" value={`₱${totalCollected.toLocaleString()}`} description="Across all fees" icon={DollarSign} />
        <StatCard title="Avg. Collection Rate" value={`${avgCompletion}%`} description="Overall completion" icon={Users} />
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">Fee List</CardTitle>
              <CardDescription className="text-muted-foreground">Click a fee to view its payment logs</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SearchInput
                placeholder="Search fees..."
                value={search}
                onChange={v => { setSearch(v); setCurrentPage(1) }}
                className="w-full sm:w-48"
              />
              <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
              <Button variant="outline" onClick={() => setGenerateOpen(true)}>
                <Zap className="size-4 mr-1" /> Generate Fee
              </Button>
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="size-4 mr-1" /> Create Fee
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "card" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paginated.map(fee => {
                const progress = fee.totalStudents > 0
                  ? Math.round((fee.paidCount / fee.totalStudents) * 100)
                  : 0
                return (
                  <Card
                    key={fee.id}
                    className="border-border bg-card cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => router.push(`/admin-fees/${fee.id}/payment_logs`)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm font-semibold text-foreground leading-snug">{fee.title}</CardTitle>
                        <ChevronRight className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                      </div>
                      <Badge variant={feeTypeVariant[fee.type]} className="w-fit text-xs">
                        {feeTypeLabels[fee.type]}
                      </Badge>
                    </CardHeader>
                    <CardContent className="pb-2">
                      {fee.description && (
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{fee.description}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                        <span>{fee.paidCount} / {fee.totalStudents} paid</span>
                        <span className="font-semibold text-foreground">₱{fee.amount.toLocaleString()}</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </CardContent>
                    <CardFooter className="pt-2">
                      <p className="text-xs text-muted-foreground">{fee.semester} · {fee.academicYear}</p>
                    </CardFooter>
                  </Card>
                )
              })}
              {paginated.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <CircleDollarSign className="size-12 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium text-foreground">No fees found</p>
                </div>
              )}
            </div>
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
              <div className="overflow-x-auto rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden md:table-cell">Collection</TableHead>
                    <TableHead className="hidden sm:table-cell">Period</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map(fee => {
                    const progress = fee.totalStudents > 0
                      ? Math.round((fee.paidCount / fee.totalStudents) * 100)
                      : 0
                    return (
                      <TableRow
                        key={fee.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => router.push(`/admin-fees/${fee.id}/payment_logs`)}
                      >
                        <TableCell>
                          <p className="text-sm font-medium text-foreground">{fee.title}</p>
                          {fee.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">{fee.description}</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={feeTypeVariant[fee.type]} className="text-xs">
                            {feeTypeLabels[fee.type]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm font-medium">₱{fee.amount.toLocaleString()}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2 min-w-32.5">
                            <Progress value={progress} className="h-1.5 flex-1" />
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {fee.paidCount}/{fee.totalStudents}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                          {fee.semester} · {fee.academicYear}
                        </TableCell>
                        <TableCell>
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {paginated.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        No fees found
                      </TableCell>
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Fee Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Fee</DialogTitle>
            <DialogDescription>Add a new Council/Organization fee.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fee-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fee-title"
                placeholder="e.g. 2nd Semester USSC Membership Fee"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fee-desc">
                Description{" "}
                <span className="text-xs text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea
                id="fee-desc"
                placeholder="Brief description of this fee..."
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fee-type">
                Type of Fee <span className="text-destructive">*</span>
              </Label>
              <Select value={newType} onValueChange={v => setNewType(v as FeeType)}>
                <SelectTrigger id="fee-type">
                  <SelectValue placeholder="Select fee type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semestral-membership">Semestral Membership</SelectItem>
                  <SelectItem value="organization-fee">Organization Fee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fee-amount">
                Amount (₱) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fee-amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={newAmount}
                onChange={e => setNewAmount(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Fee</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Generate Fee Dialog */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Fee</DialogTitle>
            <DialogDescription>
              Automatically assign a fee obligation to all currently registered members. Select which fee to generate.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            {feesList.map(fee => (
              <div
                key={fee.id}
                className="flex items-center justify-between rounded-md border border-border p-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{fee.title}</p>
                  <p className="text-xs text-muted-foreground">
                    ₱{fee.amount.toLocaleString()} · {feeTypeLabels[fee.type]}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleGenerate(fee.id)}>
                  <Zap className="size-3 mr-1" /> Generate
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
