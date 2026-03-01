import { Users, Banknote, AlertTriangle, CalendarDays, ShieldCheck, CreditCard, UserPlus } from "lucide-react"
import { StatCard } from "@/components/StatCard"
import { PageHeader } from "@/components/PageHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { students, membershipFees, fines, events, clearances, payments } from "./mock-data"

export default function AdminDashboard() {
  const approvedStudents = students.filter(s => s.status === "approved").length
  const pendingStudents = students.filter(s => s.status === "pending").length

  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
    .slice(0, 5)

  const recentStudents = [...students]
    .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
    .slice(0, 5)
  const paidFees = membershipFees.filter(f => f.status === "paid").length
  const totalCollected = membershipFees.filter(f => f.status === "paid").reduce((sum, f) => sum + f.amount, 0)
  const unpaidFines = fines.filter(f => f.status === "unpaid")
  const totalUnpaidFines = unpaidFines.reduce((sum, f) => sum + f.amount, 0)
  const clearedStudents = clearances.filter(c => c.overallStatus === "cleared").length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        context="2nd Semester · A.Y. 2025–2026"
        description="Overview of USSC operations for A.Y. 2025-2026"
      />

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
                      <span className="text-xs font-medium text-foreground">{event.attendees}</span>
                      <span className="text-xs text-muted-foreground">attendees</span>
                    </div>
                    {/* <Badge variant="secondary" className="text-xs capitalize">{event.type.replace("-", " ")}</Badge> */}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions + Recently Added Students */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-foreground">
              <CreditCard className="size-4 text-primary" />
              Recent Transactions
            </CardTitle>
            <CardDescription className="text-muted-foreground">Latest payment submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {recentPayments.map(payment => (
                <div key={payment.id} className="flex items-center justify-between rounded-md border border-border p-3 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                        {payment.studentName.split(" ").map(n => n[0]).slice(0, 2).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{payment.studentName}</p>
                      <p className="text-xs text-muted-foreground font-mono">{payment.referenceCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-semibold text-foreground">₱{payment.amount.toLocaleString()}</span>
                    {payment.status === "approved" && (
                      <Badge className="text-xs bg-green-100 text-green-800 border-green-300">Approved</Badge>
                    )}
                    {payment.status === "pending" && (
                      <Badge variant="outline" className="text-xs text-yellow-700 border-yellow-400 bg-yellow-50">Pending</Badge>
                    )}
                    {payment.status === "declined" && (
                      <Badge variant="destructive" className="text-xs">Declined</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recently Added Students */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-foreground">
              <UserPlus className="size-4 text-primary" />
              Recently Added Students
            </CardTitle>
            <CardDescription className="text-muted-foreground">Newest registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {recentStudents.map(student => (
                <div key={student.id} className="flex items-center justify-between rounded-md border border-border p-3 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                        {student.firstName[0]}{student.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{student.firstName} {student.lastName}</p>
                      <p className="text-xs text-muted-foreground">{student.studentId} · {student.program}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {student.status === "approved" && (
                      <Badge className="text-xs bg-green-100 text-green-800 border-green-300">Approved</Badge>
                    )}
                    {student.status === "pending" && (
                      <Badge variant="outline" className="text-xs text-yellow-700 border-yellow-400 bg-yellow-50">Pending</Badge>
                    )}
                    {student.status === "rejected" && (
                      <Badge variant="destructive" className="text-xs">Rejected</Badge>
                    )}
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
