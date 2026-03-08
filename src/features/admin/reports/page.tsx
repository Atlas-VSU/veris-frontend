"use client"

import { BarChart3, Download, TrendingUp } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { financialSummary, fines } from "./mock-data"
import { StatCard } from "@/components/shared/StatCard"
import { PageHeader } from "@/components/shared/PageHeader"
import { Banknote, AlertTriangle, CircleDollarSign } from "lucide-react"
import { toast } from "sonner"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts"

const COLORS = [
  "#1B5E20",   // forest Green — primary
  "#8BC34A",   // lime Green — accent
  "#FFC107",   // amber — warning
  "#2E7D32",   // medium green — secondary
]

export default function ReportsPage() {
  const totalFinesCollected = fines.filter(f => f.status === "paid").reduce((s, f) => s + f.amount, 0)
  const totalFeesCollected = 0 // Replace with actual membership fees data if available
  const totalRevenue = totalFinesCollected + totalFeesCollected

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        variant="admin"
        title="Financial Reports"
        context="2nd Semester · A.Y. 2025–2026"
        description="Financial overview and analytics for A.Y. 2025-2026"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={`P${totalRevenue.toLocaleString()}`} description="Fees + Fines collected" icon={TrendingUp} />
        <StatCard title="Fees Collected" value={`P${totalFeesCollected.toLocaleString()}`} description={`${0} payments`} icon={Banknote} />
        <StatCard title="Fines Collected" value={`P${totalFinesCollected.toLocaleString()}`} description={`${fines.filter(f => f.status === "paid").length} payments`} icon={AlertTriangle} />
        <StatCard title="Pending Amount" value={`P${financialSummary.totalPending.toLocaleString()}`} description="Unpaid fees & fines" icon={CircleDollarSign} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Monthly Collections Bar Chart */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">Monthly Collections</CardTitle>
                <CardDescription className="text-muted-foreground">Membership fee payments per month</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Export started (mock)")}>
                <Download className="size-4" /> Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialSummary.monthlyCollections}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#616161" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#616161" }} tickFormatter={v => `P${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #E0E0E0",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`P${value.toLocaleString()}`, "Amount"]}
                  />
                  <Bar dataKey="amount" fill="#1B5E20" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Fee Status Pie Chart */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">Fee Status Breakdown</CardTitle>
            <CardDescription className="text-muted-foreground">Membership fee payment status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={financialSummary.feeStatusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="count"
                    nameKey="status"
                    label={({ status, count }) => `${status}: ${count}`}
                    labelLine={false}
                  >
                    {financialSummary.feeStatusBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #E0E0E0",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    formatter={(value) => <span style={{ color: "#616161", fontSize: "12px" }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fine Status Breakdown */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">Fines Summary</CardTitle>
              <CardDescription className="text-muted-foreground">Breakdown of all issued fines</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Report generated (mock)")}>
              <BarChart3 className="size-4" /> Generate Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {financialSummary.fineStatusBreakdown.map((item, i) => (
              <div key={item.status} className="flex items-center gap-4 rounded-lg border border-border p-4">
                <div className="flex size-10 items-center justify-center rounded-full" style={{ backgroundColor: `${COLORS[i]}20` }}>
                  <div className="size-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{item.count}</p>
                  <p className="text-sm text-muted-foreground">{item.status} fines</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
