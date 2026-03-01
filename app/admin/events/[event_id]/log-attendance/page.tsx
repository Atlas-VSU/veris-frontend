"use client"

import { useState } from "react"
import Link from "next/link"
import { use } from "react"
import { ArrowLeftIcon, CalendarIcon, ClockIcon, StarIcon, UserPlusIcon, SearchIcon, CheckCircle2Icon, LogInIcon, LogOutIcon } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { events, eventAttendance } from "../../mock-data"
import { toast } from "sonner"

function formatTime(time: string | null | undefined) {
  if (!time) return null
  const [hours, minutes] = time.split(":")
  const hour = parseInt(hours, 10)
  const ampm = hour >= 12 ? "PM" : "AM"
  const h12 = hour % 12 || 12
  return `${h12}:${minutes} ${ampm}`
}

function formatTimeRange(start?: string | null, end?: string | null) {
  if (!start || !end) return null
  return `${formatTime(start)} – ${formatTime(end)}`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

interface PageProps {
  params: Promise<{ event_id: string }>
}

export default function LogAttendancePage({ params }: PageProps) {
  const { event_id } = use(params)
  const event = events.find((e) => e.id === event_id)

  const [activeTab, setActiveTab] = useState<"time-in" | "time-out">("time-in")
  const [studentId, setStudentId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recentLogs, setRecentLogs] = useState(
    eventAttendance
      .filter((a) => a.eventId === event_id)
      .slice(0, 10)
  )

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <h2 className="text-xl font-bold text-foreground">Event not found</h2>
        <p className="text-sm text-muted-foreground">The event you are looking for does not exist.</p>
        <Button asChild variant="outline">
          <Link href="/admin/events">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </Button>
      </div>
    )
  }

  const hasTimeIn = !!event.timeInStart && !!event.timeInEnd
  const hasTimeOut = !!event.timeOutStart && !!event.timeOutEnd

  const handleLogAttendance = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId.trim()) {
      toast.error("Please enter a student ID.")
      return
    }
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 600))
    // Mock: add to recent logs
    setRecentLogs((prev) => [
      {
        id: `ea-mock-${Date.now()}`,
        eventId: event_id,
        eventName: event.name,
        studentId: studentId.trim(),
        studentName: "Student (Mock)",
        status: "present",
        timeIn: new Date().toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" }),
      },
      ...prev,
    ])
    toast.success(`Attendance logged for ${studentId.trim()} (mock)`)
    setStudentId("")
    setIsSubmitting(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="bg-linear-to-br from-background via-blue-50/30 to-indigo-50/20 dark:from-background dark:via-muted/20 rounded-xl border p-6">
        <div className="flex items-start gap-3 mb-5">
          <Button variant="outline" size="icon" asChild className="h-9 w-9 shrink-0 rounded-lg">
            <Link href="/admin/events">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              {event.status === "completed" ? "Log Special Attendance" : "Log Attendance"}
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {event.status === "completed"
                ? "Record special attendance for this completed event"
                : "Record student attendance for this event"}
            </p>
          </div>
        </div>

        {/* Event Info */}
        <div className="border-t border-border pt-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-foreground wrap-break-word leading-tight">{event.name}</h2>
              <div className="w-8 h-0.5 bg-blue-500 rounded-full mt-1" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className={
                  event.status === "ongoing"
                    ? "bg-green-100 text-green-800 border-green-300"
                    : event.status === "completed"
                    ? "bg-muted text-muted-foreground"
                    : "bg-blue-100 text-blue-800 border-blue-300"
                }
              >
                {event.status === "ongoing" && (
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse inline-block" />
                )}
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Badge>
              {event.majorEvent && (
                <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 font-semibold">
                  <StarIcon className="h-3 w-3 mr-1 fill-amber-600" />
                  Major Event
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-blue-100/60 dark:bg-blue-900/20 rounded-xl flex items-center justify-center shrink-0">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground mb-0.5">Event Date</p>
                <p className="text-sm font-semibold text-foreground">{formatDate(event.date)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-emerald-100/60 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center shrink-0">
                <ClockIcon className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground mb-0.5">Schedule</p>
                <div className="text-sm font-semibold text-foreground space-y-0.5">
                  {hasTimeIn && (
                    <div>Time-in: {formatTimeRange(event.timeInStart, event.timeInEnd)}</div>
                  )}
                  {hasTimeOut && (
                    <div>Time-out: {formatTimeRange(event.timeOutStart, event.timeOutEnd)}</div>
                  )}
                  {!hasTimeIn && !hasTimeOut && (
                    <span className="text-muted-foreground font-normal">No schedule set</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <UserPlusIcon className="h-4 w-4 text-primary" />
            Log Student Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tab: Time-in / Time-out */}
          {hasTimeIn && hasTimeOut ? (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "time-in" | "time-out")} className="mb-5">
              <TabsList className="grid grid-cols-2 w-full max-w-xs">
                <TabsTrigger value="time-in" className="gap-1.5">
                  <LogInIcon className="h-3.5 w-3.5" />
                  Check-in
                </TabsTrigger>
                <TabsTrigger value="time-out" className="gap-1.5">
                  <LogOutIcon className="h-3.5 w-3.5" />
                  Check-out
                </TabsTrigger>
              </TabsList>
            </Tabs>
          ) : (
            <div className="flex items-center gap-2 mb-5">
              <Badge variant="outline" className="gap-1.5">
                {hasTimeIn ? <LogInIcon className="h-3.5 w-3.5" /> : <LogOutIcon className="h-3.5 w-3.5" />}
                {hasTimeIn ? "Check-in Only" : "Check-out Only"}
              </Badge>
            </div>
          )}

          {/* Student ID Form */}
          <form onSubmit={handleLogAttendance} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter student ID (e.g. 2024-00101)"
                className="pl-9 h-10"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" className="h-10 gap-1.5 px-5" disabled={isSubmitting}>
              {isSubmitting ? (
                "Logging…"
              ) : (
                <>
                  <CheckCircle2Icon className="h-4 w-4" />
                  Log {activeTab === "time-in" ? "Check-in" : "Check-out"}
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-3">
            Enter a valid student ID to record their {activeTab === "time-in" ? "check-in" : "check-out"} attendance for this event.
          </p>
        </CardContent>
      </Card>

      {/* Recent Attendance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
            Recent Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                <UserPlusIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">No attendance logged yet</p>
              <p className="text-xs text-muted-foreground">Logged attendance will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentLogs.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {record.studentName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-tight truncate">{record.studentName}</p>
                      <p className="text-xs text-muted-foreground">{record.studentId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {record.timeIn && (
                      <span className="text-xs text-muted-foreground">{record.timeIn}</span>
                    )}
                    <Badge
                      variant={record.status === "present" ? "default" : "outline"}
                      className={`text-xs ${
                        record.status === "present"
                          ? "bg-green-100 text-green-800 border-green-300"
                          : record.status === "excused"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                          : "bg-red-100 text-red-800 border-red-300"
                      }`}
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
