import Link from "next/link"
import { AlertTriangle, ShieldCheck, Banknote, CalendarDays, ArrowRight, Check, Clock, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Progress } from "@/src/components/ui/progress"
import {
  currentStudent,
  currentStudentFines,
  currentStudentFees,
  currentStudentClearance,
  currentStudentAttendance,
  events,
} from "./mock-data"
import { cn } from "@/src/lib/utils"

export default function PortalDashboard() {
  const unpaidFines = currentStudentFines.filter(f => f.status === "unpaid")
  const totalUnpaidAmount = unpaidFines.reduce((s, f) => s + f.amount, 0)
  const feeStatus = currentStudentFees[0]?.status || "unpaid"
  const clearance = currentStudentClearance
  const eventsAttended = currentStudentAttendance.filter(a => a.status === "present").length

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome, {currentStudent.firstName}!
        </h1>
        <p className="text-sm text-muted-foreground">
          {currentStudent.course} -- Year {currentStudent.yearLevel}, Section {currentStudent.section}
        </p>
      </div>

      {/* Quick Status Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Fines Card */}
        <Link href="/portal/fines">
          <Card className="group h-full border-border transition-all hover:border-primary hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <AlertTriangle className={cn("size-5", unpaidFines.length > 0 ? "text-destructive" : "text-muted-foreground")} />
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {unpaidFines.length > 0 ? `P${totalUnpaidAmount}` : "None"}
              </p>
              <p className="text-xs text-muted-foreground">
                {unpaidFines.length > 0 ? `${unpaidFines.length} unpaid fine(s)` : "No outstanding fines"}
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Clearance Card */}
        <Link href="/portal/clearance">
          <Card className="group h-full border-border transition-all hover:border-primary hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <ShieldCheck className={cn(
                  "size-5",
                  clearance?.overallStatus === "cleared" ? "text-success" :
                    clearance?.overallStatus === "not-cleared" ? "text-destructive" : "text-warning"
                )} />
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold capitalize text-foreground">
                {clearance?.overallStatus.replace("-", " ") || "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">
                Clearance status -- 1st Sem
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Fees Card */}
        <Link href="/portal/fees">
          <Card className="group h-full border-border transition-all hover:border-primary hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Banknote className={cn("size-5", feeStatus === "paid" ? "text-success" : "text-warning")} />
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold capitalize text-foreground">{feeStatus}</p>
              <p className="text-xs text-muted-foreground">Membership fee -- P150.00</p>
            </CardContent>
          </Card>
        </Link>

        {/* Events Card */}
        <Link href="/portal/events">
          <Card className="group h-full border-border transition-all hover:border-primary hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CalendarDays className="size-5 text-primary" />
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{eventsAttended}</p>
              <p className="text-xs text-muted-foreground">Events attended this semester</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Bottom: Clearance Requirements + Recent Activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Clearance Requirements */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Clearance Requirements</CardTitle>
            <CardDescription className="text-muted-foreground">A.Y. 2024-2025 -- 1st Semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {clearance?.requirements.map(r => {
                const Icon = r.status === "cleared" ? Check : r.status === "pending" ? Clock : X
                return (
                  <div
                    key={r.name}
                    className={cn(
                      "flex items-center justify-between rounded-md border p-3",
                      r.status === "cleared" ? "border-success/20 bg-success/5" :
                        r.status === "not-cleared" ? "border-destructive/20 bg-destructive/5" :
                          "border-border"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex size-6 items-center justify-center rounded-full",
                        r.status === "cleared" ? "bg-success text-success-foreground" :
                          r.status === "not-cleared" ? "bg-destructive/20 text-destructive" :
                            "bg-muted text-muted-foreground"
                      )}>
                        <Icon className="size-3" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{r.name}</span>
                    </div>
                    <Badge
                      variant={r.status === "cleared" ? "secondary" : r.status === "not-cleared" ? "destructive" : "outline"}
                      className="capitalize text-xs"
                    >
                      {r.status.replace("-", " ")}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Event Attendance</CardTitle>
            <CardDescription className="text-muted-foreground">Your attendance records this semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {currentStudentAttendance.map(a => (
                <div key={a.id} className="flex items-center justify-between rounded-md border border-border p-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">{a.eventName}</span>
                    <span className="text-xs text-muted-foreground">
                      {a.timeIn ? `Time in: ${a.timeIn}` : "No time recorded"}
                    </span>
                  </div>
                  <Badge
                    variant={a.status === "present" ? "secondary" : a.status === "absent" ? "destructive" : "outline"}
                    className="capitalize"
                  >
                    {a.status}
                  </Badge>
                </div>
              ))}
              {currentStudentAttendance.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">No events attended yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
