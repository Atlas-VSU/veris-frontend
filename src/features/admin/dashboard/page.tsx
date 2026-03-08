import { Users, Banknote, AlertTriangle, CalendarDays, ShieldCheck, CreditCard, UserPlus } from "lucide-react"
import { StatCard } from "@/components/shared/StatCard"
import { PageHeader } from "@/components/shared/PageHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { students, fines, events, payments } from "./mock-data"

export default function AdminDashboard() {
  // const approvedStudents = students.filter(s => s.status === "approved").length
  // const pendingStudents = students.filter(s => s.status === "pending").length

  const approvedStudents = 8670
  const pendingStudents = 905

  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
    .slice(0, 5)

  const recentStudents = [...students]
    .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
    .slice(0, 5)
  const paidFees = 728
  const totalCollected = 982731
  const unpaidFines = fines.filter(f => f.status === "unpaid")
  const totalUnpaidFines = unpaidFines.reduce((sum, f) => sum + f.amount, 0)
  const clearedStudents = 700
  const totalStudents = 9575;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        variant="admin"
        title="Dashboard"
        context="2nd Semester · A.Y. 2025–2026"
        description="Overview of operations for the current semester."
      />

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={totalStudents}
          description={`${approvedStudents} approved, ${pendingStudents} pending`}
          icon={Users}
        />
        <StatCard
          title="Fees Collected"
          value={`P${totalCollected.toLocaleString()}`}
          description={`${paidFees} of ${totalStudents} students paid`}
          icon={Banknote}
          trend={{ value: `${Math.round((paidFees / totalStudents) * 100)}% collection rate`, positive: true }}
        />
        <StatCard
          title="Unpaid Fines"
          value={`P${totalUnpaidFines.toLocaleString()}`}
          description={`${unpaidFines.length} outstanding fines`}
          icon={AlertTriangle}
        />
        <StatCard
          title="Clearance"
          value={`${clearedStudents}/${totalStudents}`}
          description="Students fully cleared"
          icon={ShieldCheck}
          trend={{ value: `${Math.round((clearedStudents / totalStudents) * 100)}% clearance rate`, positive: clearedStudents > totalStudents / 2 }}
        />
      </div>

      {/* Content Grid: Primary (Transactions) + Sidebar (Events, Students) */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Recent Transactions — Primary */}
        <Card className="border-border bg-card md:col-span-3 lg:col-span-2 gap-0">
          <CardHeader className="px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
              <CreditCard className="size-4 text-primary" />
              Recent Transactions
            </CardTitle>
            <CardDescription className="text-muted-foreground">Latest payment submissions</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="flex flex-col gap-2">
              {recentPayments.map(payment => (
                <div key={payment.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2.5 gap-3">
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
                      <Badge className="text-xs bg-[#C8E6C9] text-[#1B5E20] border-[#A5D6A7]">Approved</Badge>
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

        {/* Sidebar: Events + Recently Added Students */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:col-span-3 lg:col-span-1">
          {/* Major Events */}
          <Card className="border-border bg-card gap-0">
            <CardHeader className="px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                <CalendarDays className="size-4 text-primary" />
                Major Events
              </CardTitle>
              <CardDescription className="text-muted-foreground">{events.filter(e => e.majorEvent).length} major events this semester</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
              <div className="flex flex-col gap-2">
                {events.filter(e => e.majorEvent).slice(0, 5).map(event => (
                  <div key={event.id} className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{event.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {new Date(event.date).toLocaleDateString("en-PH", { month: "short", day: "numeric" })} · {event.location}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-xs font-semibold text-foreground">{event.attendees}</span>
                      <p className="text-[10px] text-muted-foreground">attendees</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recently Added Students */}
          <Card className="border-border bg-card gap-0">
            <CardHeader className="px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                <UserPlus className="size-4 text-primary" />
                Recently Added Students
              </CardTitle>
              <CardDescription className="text-muted-foreground">Newest registrations</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
              <div className="flex flex-col gap-2">
                {recentStudents.map(student => (
                  <div key={student.id} className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar className="size-7 shrink-0">
                        <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
                          {student.firstName[0]}{student.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{student.firstName} {student.lastName}</p>
                        <p className="text-xs text-muted-foreground truncate">{student.studentId} · {student.program}</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {student.status === "approved" && (
                        <Badge className="text-[10px] bg-[#C8E6C9] text-[#1B5E20] border-[#A5D6A7]">Approved</Badge>
                      )}
                      {student.status === "pending" && (
                        <Badge variant="outline" className="text-[10px] text-yellow-700 border-yellow-400 bg-yellow-50">Pending</Badge>
                      )}
                      {student.status === "rejected" && (
                        <Badge variant="destructive" className="text-[10px]">Rejected</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
