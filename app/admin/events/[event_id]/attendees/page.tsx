"use client"

import { use, useState } from "react"
import Link from "next/link"
import { ArrowLeftIcon, SearchIcon, UsersIcon, CalendarIcon, UserPlusIcon } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { DataPagination } from "@/components/DataPagination"
import { events, eventAttendance } from "../../mock-data"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

interface PageProps {
  params: Promise<{ event_id: string }>
}

export default function AttendeesPage({ params }: PageProps) {
  const { event_id } = use(params)
  const event = events.find((e) => e.id === event_id)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 10
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

  const attendance = eventAttendance.filter((a) => a.eventId === event_id)
  const filtered = attendance.filter(
    (a) =>
      !search ||
      a.studentName.toLowerCase().includes(search.toLowerCase()) ||
      a.studentId.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const presentCount = attendance.filter((a) => a.status === "present").length
  const absentCount = attendance.filter((a) => a.status === "absent").length
  const excusedCount = attendance.filter((a) => a.status === "excused").length

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild className="h-9 w-9 shrink-0 rounded-lg">
            <Link href="/admin/events">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground leading-tight">{event.name}</h1>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <CalendarIcon className="h-3.5 w-3.5" />
              {formatDate(event.date)}
            </div>
          </div>
        </div>
        <Button asChild size="sm" className="gap-1.5 self-start sm:self-auto">
          <Link href={`/admin/events/${event_id}/log-attendance`}>
            <UserPlusIcon className="h-4 w-4" />
            Log Attendance
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4">
          <div className="text-2xl font-bold text-foreground">{attendance.length}</div>
          <div className="text-xs text-muted-foreground font-medium mt-0.5">Total Records</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">{presentCount}</div>
          <div className="text-xs text-muted-foreground font-medium mt-0.5">Present</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-red-500">{absentCount}</div>
          <div className="text-xs text-muted-foreground font-medium mt-0.5">Absent</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-yellow-600">{excusedCount}</div>
          <div className="text-xs text-muted-foreground font-medium mt-0.5">Excused</div>
        </Card>
      </div>

      {/* Search + List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
            Attendance Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name or ID…"
              className="pl-9 h-9"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            />
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                <UsersIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">No attendance records found</p>
              <p className="text-xs text-muted-foreground">
                {search ? "Try adjusting your search." : "No attendance has been logged for this event yet."}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {paginated.map((record) => (
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
                        <span className="text-xs text-muted-foreground hidden sm:block">{record.timeIn}</span>
                      )}
                      <Badge
                        className={`text-xs font-semibold ${
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
              <DataPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
