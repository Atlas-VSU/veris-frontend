"use client"

import { useState } from "react"
import { CalendarDays, MapPin, Clock } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { DataPagination } from "@/components/shared/DataPagination"
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
    <div className="flex flex-col gap-5 sm:gap-6">
      <PageHeader
        variant="portal"
        title="Event Attendance"
        context="2nd Semester · A.Y. 2025–2026"
        description="Your event participation this semester"
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card className="border-[#E0E0E0] bg-white shadow-sm transition-all duration-200 hover:shadow-md">
          <CardContent className="p-3 sm:pt-6 sm:px-6">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#8BC34A]/10 sm:size-10">
                <CalendarDays className="size-4 text-[#8BC34A] sm:size-5" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xl font-bold text-foreground sm:text-2xl">{present}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">Attended</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#E0E0E0] bg-white shadow-sm transition-all duration-200 hover:shadow-md">
          <CardContent className="p-3 sm:pt-6 sm:px-6">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 sm:size-10">
                <CalendarDays className="size-4 text-destructive sm:size-5" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xl font-bold text-foreground sm:text-2xl">{absent}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">Absences</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#E0E0E0] bg-white shadow-sm transition-all duration-200 hover:shadow-md">
          <CardContent className="p-3 sm:pt-6 sm:px-6">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1B5E20]/10 sm:size-10">
                <CalendarDays className="size-4 text-[#1B5E20] sm:size-5" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xl font-bold text-foreground sm:text-2xl">{excused}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">Excused</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Records */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">Attendance History</h3>
        {paginated.map(attendance => {
          const event = events.find(e => e.id === attendance.eventId)
          return (
            <Card key={attendance.id} className="border-[#E0E0E0] bg-white shadow-sm transition-colors duration-150 hover:border-[#1B5E20]/30">
              <CardContent className="px-3 py-3 sm:px-6 sm:py-4">
                <div className="flex items-start justify-between gap-2 sm:items-center">
                  <div className="flex min-w-0 flex-col gap-1 sm:gap-1.5">
                    <p className="truncate text-xs font-medium text-foreground sm:text-sm">{attendance.eventName}</p>
                    <div className="flex flex-col gap-0.5 text-[10px] text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:text-xs">
                      {event && (
                        <>
                          <span className="flex items-center gap-1">
                            <CalendarDays className="size-3 shrink-0" />
                            {new Date(event.date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3 shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </span>
                        </>
                      )}
                      {attendance.timeIn && (
                        <span className="flex items-center gap-1">
                          <Clock className="size-3 shrink-0" />
                          Time in: {attendance.timeIn}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant={attendanceVariant[attendance.status]} className="ml-2 shrink-0 capitalize text-[10px] sm:text-xs">
                    {attendance.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {currentStudentAttendance.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center sm:py-12">
            <CalendarDays className="size-10 text-muted-foreground sm:size-12" />
            <h3 className="mt-3 text-xs font-bold uppercase tracking-wide text-foreground sm:text-sm">No attendance records</h3>
            <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">You have no event attendance records yet.</p>
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
