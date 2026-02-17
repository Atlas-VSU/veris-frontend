"use client"

import { useState } from "react"
import { ShieldCheck, Search, Download, Check, X, Clock } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
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
import { clearances as initialClearances } from "./mock-data"
import type { Clearance, ClearanceItemStatus } from "./types"
import { toast } from "sonner"
import { StatCard } from "@/components/stat-card"
import { Users, AlertTriangle } from "lucide-react"
import { cn } from "@/src/lib/utils"

const overallVariant: Record<ClearanceItemStatus, "secondary" | "destructive" | "outline"> = {
  cleared: "secondary",
  "not-cleared": "destructive",
  pending: "outline",
}

const reqIcon: Record<ClearanceItemStatus, typeof Check> = {
  cleared: Check,
  pending: Clock,
  "not-cleared": X,
}

export default function ClearancePage() {
  const [clearanceList, setClearanceList] = useState<Clearance[]>(initialClearances)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedClearance, setSelectedClearance] = useState<Clearance | null>(null)

  const filtered = clearanceList.filter(c => {
    const matchesSearch = c.studentName.toLowerCase().includes(search.toLowerCase()) || c.studentId.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === "all" || c.overallStatus === filterStatus
    return matchesSearch && matchesStatus
  })

  const cleared = clearanceList.filter(c => c.overallStatus === "cleared").length
  const pending = clearanceList.filter(c => c.overallStatus === "pending").length
  const notCleared = clearanceList.filter(c => c.overallStatus === "not-cleared").length

  function handleToggleRequirement(clearanceId: string, reqName: string) {
    setClearanceList(prev => prev.map(c => {
      if (c.id !== clearanceId) return c
      const updatedReqs = c.requirements.map(r => {
        if (r.name !== reqName) return r
        const nextStatus: ClearanceItemStatus = r.status === "cleared" ? "not-cleared" : "cleared"
        return { ...r, status: nextStatus }
      })
      const allCleared = updatedReqs.every(r => r.status === "cleared")
      const anyNotCleared = updatedReqs.some(r => r.status === "not-cleared")
      const overallStatus: ClearanceItemStatus = allCleared ? "cleared" : anyNotCleared ? "not-cleared" : "pending"
      const updated = { ...c, requirements: updatedReqs, overallStatus }
      if (selectedClearance?.id === clearanceId) setSelectedClearance(updated)
      return updated
    }))
    toast.success("Requirement updated")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Clearance Management</h1>
        <p className="text-sm text-muted-foreground">Review and manage student clearance statuses</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Cleared" value={cleared} description="Students fully cleared" icon={ShieldCheck} />
        <StatCard title="Pending" value={pending} description="Awaiting requirements" icon={Users} />
        <StatCard title="Not Cleared" value={notCleared} description="Outstanding issues" icon={AlertTriangle} />
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base text-foreground">Clearance Records</CardTitle>
              <CardDescription className="text-muted-foreground">A.Y. 2024-2025 -- 1st Semester</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 w-56" />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="cleared">Cleared</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="not-cleared">Not Cleared</SelectItem>
                </SelectContent>
              </Select>
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
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Requirements</TableHead>
                  <TableHead>Overall Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(c => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{c.studentName}</span>
                        <span className="text-xs text-muted-foreground">{c.studentId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.academicYear}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.semester}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {c.requirements.map(r => {
                          const Icon = reqIcon[r.status]
                          return (
                            <span
                              key={r.name}
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                                r.status === "cleared" && "bg-success/10 text-success",
                                r.status === "pending" && "bg-warning/10 text-warning-foreground",
                                r.status === "not-cleared" && "bg-destructive/10 text-destructive",
                              )}
                            >
                              <Icon className="size-3" />
                              {r.name}
                            </span>
                          )
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={overallVariant[c.overallStatus]} className="capitalize">
                        {c.overallStatus.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedClearance(c)}>Manage</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-foreground">Clearance -- {c.studentName}</DialogTitle>
                            <DialogDescription className="text-muted-foreground">{c.studentId} | {c.academicYear} {c.semester}</DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col gap-3 py-4">
                            {(selectedClearance?.id === c.id ? selectedClearance : c).requirements.map(r => {
                              const Icon = reqIcon[r.status]
                              return (
                                <button
                                  key={r.name}
                                  onClick={() => handleToggleRequirement(c.id, r.name)}
                                  className={cn(
                                    "flex items-center justify-between rounded-md border p-3 text-left transition-colors",
                                    r.status === "cleared" ? "border-success/30 bg-success/5" : r.status === "not-cleared" ? "border-destructive/30 bg-destructive/5" : "border-border"
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={cn(
                                      "flex size-7 items-center justify-center rounded-full",
                                      r.status === "cleared" ? "bg-success text-success-foreground" : r.status === "not-cleared" ? "bg-destructive text-destructive" : "bg-muted text-muted-foreground"
                                    )}>
                                      <Icon className="size-3.5" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">{r.name}</span>
                                  </div>
                                  <Badge variant={overallVariant[r.status]} className="capitalize text-xs">
                                    {r.status.replace("-", " ")}
                                  </Badge>
                                </button>
                              )
                            })}
                          </div>
                          <p className="text-xs text-muted-foreground">Click a requirement to toggle its status.</p>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No clearance records found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
