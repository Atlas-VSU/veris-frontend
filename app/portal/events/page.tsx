import { CalendarDays, MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { currentStudentAttendance, events } from "./mock-data"
import { cn } from "@/src/lib/utils"
import type { AttendanceStatus } from "./types"

const attendanceVariant: Record<AttendanceStatus, "secondary" | "destructive" | "outline"> = {
  present: "secondary",
  absent: "destructive",
  excused: "outline",
}

export default function PortalEventsPage() {
  const present = currentStudentAttendance.filter(a => a.status === "present").length
  const absent = currentStudentAttendance.filter(a => a.status === "absent").length
  const excused = currentStudentAttendance.filter(a => a.status === "excused").length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Event Attendance</h1>
        <p className="text-sm text-muted-foreground">Your event participation this semester</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-success/10">
                <CalendarDays className="size-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{present}</p>
                <p className="text-xs text-muted-foreground">Events attended</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
                <CalendarDays className="size-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{absent}</p>
                <p className="text-xs text-muted-foreground">Absences</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <CalendarDays className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{excused}</p>
                <p className="text-xs text-muted-foreground">Excused</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Records */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Attendance History</h3>
        {currentStudentAttendance.map(attendance => {
          const event = events.find(e => e.id === attendance.eventId)
          return (
            <Card key={attendance.id} className="border-border">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium text-foreground">{attendance.eventName}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {event && (
                        <>
                          <span className="flex items-center gap-1">
                            <CalendarDays className="size-3" />
                            {new Date(event.date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            {event.location}
                          </span>
                        </>
                      )}
                      {attendance.timeIn && (
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          Time in: {attendance.timeIn}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant={attendanceVariant[attendance.status]} className="capitalize">
                    {attendance.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {currentStudentAttendance.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarDays className="size-12 text-muted-foreground" />
            <h3 className="mt-3 text-sm font-medium text-foreground">No attendance records</h3>
            <p className="mt-1 text-xs text-muted-foreground">You have no event attendance records yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
