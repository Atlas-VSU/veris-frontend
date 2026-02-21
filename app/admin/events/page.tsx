"use client"

import { useState } from "react"
import { CalendarDays, Plus, MapPin, Users, Clock, Search } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Progress } from "@/src/components/ui/progress"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/src/components/ui/dialog"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/src/components/ui/table"
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/src/components/ui/tabs"
import { events as initialEvents, eventAttendance } from "./mock-data"
import type { Event as EventType } from "./types"
import { toast } from "sonner"
import { StatCard } from "@/components/stat-card"
import { cn } from "@/src/lib/utils"

const typeColors: Record<string, string> = {
  "general-assembly": "bg-primary/10 text-primary",
  seminar: "bg-chart-2/10 text-chart-2",
  workshop: "bg-chart-3/10 text-chart-3",
  social: "bg-chart-5/10 text-chart-5",
  meeting: "bg-muted text-muted-foreground",
}

export default function EventsPage() {
  const [eventsList] = useState<EventType[]>(initialEvents)
  const [selectedEventId, setSelectedEventId] = useState<string>(initialEvents[0]?.id || "")
  const [addOpen, setAddOpen] = useState(false)

  const selectedEvent = eventsList.find(e => e.id === selectedEventId)
  const selectedAttendance = eventAttendance.filter(a => a.eventId === selectedEventId)
  const totalAttendees = eventsList.reduce((s, e) => s + e.attendeesCount, 0)
  const avgAttendance = Math.round(eventsList.reduce((s, e) => s + (e.attendeesCount / e.totalStudents) * 100, 0) / eventsList.length)

  function handleAddEvent(formData: FormData) {
    toast.success("Event created (mock)")
    setAddOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Events Management</h1>
        <p className="text-sm text-muted-foreground">Create events and track attendance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Events" value={eventsList.length} description="This semester" icon={CalendarDays} />
        <StatCard title="Total Attendees" value={totalAttendees} description="Across all events" icon={Users} />
        <StatCard title="Avg. Attendance" value={`${avgAttendance}%`} description="Average attendance rate" icon={Clock} />
      </div>

      <Tabs defaultValue="events" className="w-full">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="size-4" /> Create Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Event</DialogTitle>
                <DialogDescription>Add a new event for the semester.</DialogDescription>
              </DialogHeader>
              <form action={handleAddEvent} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="eventName">Event Name</label>
                  <Input name="eventName" id="eventName" placeholder="e.g. General Assembly" required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="eventDesc">Description</label>
                  <Input name="eventDesc" id="eventDesc" placeholder="Brief description..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="eventDate">Date</label>
                    <Input name="eventDate" id="eventDate" type="date" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="eventLocation">Location</label>
                    <Input name="eventLocation" id="eventLocation" placeholder="Venue" required />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                  <Button type="submit">Create Event</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="events" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eventsList.map(event => {
              const pct = Math.round((event.attendeesCount / event.totalStudents) * 100)
              return (
                <Card
                  key={event.id}
                  className={cn(
                    "cursor-pointer border-border transition-all hover:shadow-md",
                    selectedEventId === event.id && "border-primary ring-1 ring-primary/20"
                  )}
                  onClick={() => setSelectedEventId(event.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-semibold text-foreground">{event.name}</CardTitle>
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium capitalize", typeColors[event.type] || "bg-muted text-muted-foreground")}>
                        {event.type.replace("-", " ")}
                      </span>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><CalendarDays className="size-3" />{new Date(event.date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</span>
                        <span className="flex items-center gap-1"><MapPin className="size-3" />{event.location}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Attendance</span>
                          <span className="font-medium text-foreground">{event.attendeesCount}/{event.totalStudents} ({pct}%)</span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">
                Attendance -- {selectedEvent?.name || "Select an event"}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {selectedAttendance.length} attendance records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time In</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedAttendance.map(a => (
                      <TableRow key={a.id}>
                        <TableCell className="text-sm font-medium text-foreground">{a.studentName}</TableCell>
                        <TableCell className="text-sm font-mono text-muted-foreground">{a.studentId}</TableCell>
                        <TableCell>
                          <Badge
                            variant={a.status === "present" ? "secondary" : a.status === "absent" ? "destructive" : "outline"}
                            className="capitalize"
                          >
                            {a.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{a.timeIn || "--"}</TableCell>
                      </TableRow>
                    ))}
                    {selectedAttendance.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">No attendance records for this event.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
