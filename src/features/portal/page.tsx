import Link from "next/link"
import { AlertTriangle, ShieldCheck, Banknote, CalendarDays, ArrowRight, Check, Clock, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import {
  currentStudent,
  currentStudentFines,
  currentStudentPaymentLogs,
  currentStudentClearance,
  currentStudentAttendance,
} from "./mock-data"
import { cn } from "@/src/lib/utils"
import { PageHeader } from "@/components/shared/PageHeader"

export default function PortalDashboard() {
  const unpaidFines = currentStudentFines.filter(f => f.status === "unpaid")
  const totalUnpaidAmount = unpaidFines.reduce((s, f) => s + f.amount, 0)
  const hasPaidFee = currentStudentPaymentLogs.some(l => l.status === "verified")
  const hasPendingFee = currentStudentPaymentLogs.some(l => l.status === "pending_verification")
  const feeStatus = hasPaidFee ? "paid" : hasPendingFee ? "pending" : "unpaid"
  const clearance = currentStudentClearance
  const eventsAttended = currentStudentAttendance.filter(a => a.status === "present").length

  const statusCards = [
    {
      href: "/portal-fines",
      icon: AlertTriangle,
      iconColor: unpaidFines.length > 0 ? "text-destructive" : "text-muted-foreground",
      value: unpaidFines.length > 0 ? `₱${totalUnpaidAmount}` : "None",
      label: unpaidFines.length > 0 ? `${unpaidFines.length} unpaid fine(s)` : "No outstanding fines",
      title: "FINES",
    },
    {
      href: "/portal-clearance",
      icon: ShieldCheck,
      iconColor: clearance?.overallStatus === "cleared" ? "text-[#8BC34A]" :
        clearance?.overallStatus === "not-cleared" ? "text-destructive" : "text-[#1B5E20]",
      value: clearance?.overallStatus.replace("-", " ") || "N/A",
      label: "Clearance status",
      title: "CLEARANCE",
    },
    {
      href: "/portal-fees",
      icon: Banknote,
      iconColor: feeStatus === "paid" ? "text-[#8BC34A]" : "text-[#1B5E20]",
      value: feeStatus,
      label: "Fees this semester",
      title: "FEES",
    },
    {
      href: "/portal-events",
      icon: CalendarDays,
      iconColor: "text-[#1B5E20]",
      value: eventsAttended.toString(),
      label: "Events attended",
      title: "EVENTS",
    },
  ]

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <PageHeader
        variant="portal"
        title="Student Dashboard"
        context="2nd Semester · A.Y. 2025–2026"
        description={`Welcome, ${currentStudent.firstName} ${currentStudent.lastName} · ${currentStudent.program} — Year ${currentStudent.yearLevel}`}
      />

      {/* Quick Status Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {statusCards.map(card => (
          <Link key={card.href} href={card.href}>
            <Card className="group h-full border-[#E0E0E0] bg-white shadow-sm transition-all hover:border-[#1B5E20]/40 hover:shadow-md">
              <CardHeader className="px-3 pb-1 pt-3 sm:px-6 sm:pb-2 sm:pt-6">
                <div className="flex items-center justify-between">
                  <card.icon className={cn("size-4 sm:size-5", card.iconColor)} />
                  <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:size-4" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{card.title}</p>
              </CardHeader>
              <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
                <p className="text-lg font-bold capitalize text-foreground sm:text-2xl">
                  {card.value}
                </p>
                <p className="text-[10px] text-muted-foreground sm:text-xs">
                  {card.label}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Clearance Requirements */}
        <Card className="overflow-hidden border-[#E0E0E0] bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">Clearance Requirements</CardTitle>
            <CardDescription className="text-xs text-[#1B5E20]/50">A.Y. 2025-2026 — 1st Semester</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex flex-col gap-2">
              {clearance?.requirements.map(r => {
                const Icon = r.status === "cleared" ? Check : r.status === "pending" ? Clock : X
                return (
                  <div
                    key={r.name}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 sm:p-3",
                      r.status === "cleared" ? "border-[#8BC34A]/30 bg-[#8BC34A]/5" :
                        r.status === "not-cleared" ? "border-destructive/20 bg-destructive/5" :
                          "border-[#E0E0E0] bg-[#1B5E20]/2"
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                      <div className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full",
                        r.status === "cleared" ? "bg-[#8BC34A] text-white" :
                          r.status === "not-cleared" ? "bg-destructive/20 text-destructive" :
                            "bg-[#1B5E20]/10 text-[#1B5E20]"
                      )}>
                        <Icon className="size-3" />
                      </div>
                      <span className="truncate text-xs font-medium text-foreground sm:text-sm">{r.name}</span>
                    </div>
                    <Badge
                      variant={r.status === "cleared" ? "secondary" : r.status === "not-cleared" ? "destructive" : "outline"}
                      className="shrink-0 capitalize text-[10px] sm:text-xs"
                    >
                      {r.status.replace("-", " ")}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-[#E0E0E0] bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">Event Attendance</CardTitle>
            <CardDescription className="text-xs text-[#1B5E20]/50">Your attendance records this semester</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
              {currentStudentAttendance.map(a => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border border-[#E0E0E0] px-3 py-2.5 transition-colors duration-150 hover:bg-[#FAFAFA] sm:p-3">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-xs font-medium text-foreground sm:text-sm">{a.eventName}</span>
                    <span className="text-[10px] text-muted-foreground sm:text-xs">
                      {a.timeIn ? `Time in: ${a.timeIn}` : "No time recorded"}
                    </span>
                  </div>
                  <Badge
                    variant={a.status === "present" ? "secondary" : a.status === "absent" ? "destructive" : "outline"}
                    className="ml-2 shrink-0 capitalize text-[10px] sm:text-xs"
                  >
                    {a.status}
                  </Badge>
                </div>
              ))}
              {currentStudentAttendance.length === 0 && (
                <p className="py-4 text-center text-xs text-muted-foreground sm:text-sm">No events attended yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
