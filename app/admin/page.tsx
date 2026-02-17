import { Users, Banknote, AlertTriangle, CalendarDays, ShieldCheck, TrendingUp } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { students, membershipFees, fines, events, clearances } from "./mock-data"

export default function AdminDashboard() {
  const approvedStudents = students.filter(s => s.status === "approved").length
  const pendingStudents = students.filter(s => s.status === "pending").length
  const paidFees = membershipFees.filter(f => f.status === "paid").length
  const totalCollected = membershipFees.filter(f => f.status === "paid").reduce((sum, f) => sum + f.amount, 0)
  const unpaidFines = fines.filter(f => f.status === "unpaid")
  const totalUnpaidFines = unpaidFines.reduce((sum, f) => sum + f.amount, 0)
  const clearedStudents = clearances.filter(c => c.overallStatus === "cleared").length
  const upcomingEvents = events.filter(e => new Date(e.date) > new Date("2024-10-01"))

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of USSC operations for A.Y. 2024-2025</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={students.length}
          description={`${approvedStudents} approved, ${pendingStudents} pending`}
          icon={Users}
        />
        <StatCard
          title="Fees Collected"
          value={`P${totalCollected.toLocaleString()}`}
          description={`${paidFees} of ${membershipFees.length} students paid`}
          icon={Banknote}
          trend={{ value: `${Math.round((paidFees / membershipFees.length) * 100)}% collection rate`, positive: true }}
        />
        <StatCard
          title="Unpaid Fines"
          value={`P${totalUnpaidFines.toLocaleString()}`}
          description={`${unpaidFines.length} outstanding fines`}
          icon={AlertTriangle}
        />
        <StatCard
          title="Clearance"
          value={`${clearedStudents}/${clearances.length}`}
          description="Students fully cleared"
          icon={ShieldCheck}
          trend={{ value: `${Math.round((clearedStudents / clearances.length) * 100)}% clearance rate`, positive: clearedStudents > clearances.length / 2 }}
        />
      </div>

      {/* Bottom Grid: Recent Fines + Upcoming Events */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Unpaid Fines */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-foreground">
              <AlertTriangle className="size-4 text-destructive" />
              Recent Unpaid Fines
            </CardTitle>
            <CardDescription className="text-muted-foreground">{unpaidFines.length} fines require attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {unpaidFines.slice(0, 5).map(fine => (
                <div key={fine.id} className="flex items-center justify-between rounded-md border border-border p-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">{fine.studentName}</span>
                    <span className="text-xs text-muted-foreground">{fine.reason}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">P{fine.amount}</span>
                    <Badge variant="destructive" className="text-xs">Unpaid</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-foreground">
              <CalendarDays className="size-4 text-primary" />
              Events
            </CardTitle>
            <CardDescription className="text-muted-foreground">{events.length} total events this semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {events.map(event => (
                <div key={event.id} className="flex items-center justify-between rounded-md border border-border p-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">{event.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })} -- {event.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-medium text-foreground">{event.attendeesCount}/{event.totalStudents}</span>
                      <span className="text-xs text-muted-foreground">attended</span>
                    </div>
                    <Badge variant="secondary" className="text-xs capitalize">{event.type.replace("-", " ")}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
