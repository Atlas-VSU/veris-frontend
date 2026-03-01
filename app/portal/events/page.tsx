"use client"

import { useState } from "react"
import { CalendarDays, MapPin, Clock } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { DataPagination } from "@/components/DataPagination"
import { currentStudentAttendance, events } from "./mock-data"
import type { AttendanceStatus } from "./types"

const ITEMS_PER_PAGE = 10

const attendanceVariant: Record<AttendanceStatus, "secondary" | "destructive" | "outline"> = {
  present: "secondary",
  absent: "destructive",
  excused: "outline",
}

export default function PortalEventsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const present = currentStudentAttendance.filter(a => a.status === "present").length
  const absent = currentStudentAttendance.filter(a => a.status === "absent").length
  const excused = currentStudentAttendance.filter(a => a.status === "excused").length

  const totalPages = Math.ceil(currentStudentAttendance.length / ITEMS_PER_PAGE)
  const paginated = currentStudentAttendance.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Event Attendance"
        context="2nd Semester · A.Y. 2025–2026"
        description="Your event participation this semester"
      />

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
        {paginated.map(attendance => {
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
        <DataPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={currentStudentAttendance.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}
