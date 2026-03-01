"use client"

import { useState, useEffect, useRef } from "react"
import { CalendarDays, Users, Clock, Plus, Search } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { StatCard } from "@/components/StatCard"
import { PageHeader } from "@/components/PageHeader"
import { useIsMobile } from "@/src/hooks/useIsMobile"
import { events as initialEvents } from "./mock-data"
import { useEventsFiltering } from "./hooks/useEventsFiltering"
import { EventsList } from "./components/EventsList"
import { EventsTabNavigation } from "./components/EventsTabNavigation"
import { EventsFilters } from "./components/EventsFilters"
import { EventsPagination } from "./components/EventsPagination"
import { AddEventDialog } from "./components/AddEventDialog"
import { EventsSearchBar } from "./components/EventsSearchBar"
import { EventsSkeletonLoader } from "./components/EventsSkeletonLoader"
import type { ViewMode } from "./components/ViewToggle"

export default function EventsPage() {
  const [events, setEvents] = useState(initialEvents)
  const [addOpen, setAddOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("card")
  const [loading, setLoading] = useState(true)
  const isMobile = useIsMobile()
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Simulate initial data load
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  const {
    paginatedEvents,
    sortedEvents,
    searchQuery,
    currentTab,
    currentPage,
    totalPages,
    handleSearch,
    setDateFilter,
    setSortByFilter,
    handleTabChange,
    setCurrentPage,
  } = useEventsFiltering(events)

  const completedEvents = events.filter((e) => e.status === "completed" || e.status === "ongoing")
  const totalAttendees = completedEvents.reduce((s, e) => s + e.attendees, 0)
  const avgAttendance =
    completedEvents.length > 0
      ? Math.round(completedEvents.reduce((s, e) => s + e.attendees, 0) / completedEvents.length)
      : 0

  const handleEventsUpdate = () => {
    setEvents((prev) => [...prev])
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Events Management"
        context="2nd Semester · A.Y. 2025–2026"
        description="Manage your organisation's events and track attendance"
        action={
          <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            Add Event
          </Button>
        }
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Events" value={events.length} description="This semester" icon={CalendarDays} />
        <StatCard title="Total Attendees" value={totalAttendees} description="Across all events" icon={Users} />
        <StatCard title="Avg. Attendees" value={avgAttendance} description="Per completed event" icon={Clock} />
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          type="search"
          placeholder="Search events by name or location…"
          className="pl-9 h-10 bg-background"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Active search banner */}
      {searchQuery && (
        <EventsSearchBar
          searchQuery={searchQuery}
          resultsCount={sortedEvents.length}
          onClear={() => {
            handleSearch("")
            if (searchInputRef.current) searchInputRef.current.value = ""
          }}
        />
      )}

      {/* Tab navigation */}
      <EventsTabNavigation
        currentTab={currentTab}
        onTabChange={handleTabChange}
        isDesktop={!isMobile}
      />

      {/* Filters row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {sortedEvents.length} event{sortedEvents.length !== 1 ? "s" : ""} found
        </p>
        <EventsFilters
          onSetDate={setDateFilter}
          onSortBy={setSortByFilter}
          viewMode={viewMode}
          onViewChange={setViewMode}
          isDesktop={!isMobile}
        />
      </div>

      {/* Events list */}
      {loading ? (
        <EventsSkeletonLoader viewMode={viewMode} />
      ) : (
        <EventsList
          events={paginatedEvents}
          onEventsUpdate={handleEventsUpdate}
          viewMode={viewMode}
        />
      )}

      {/* Pagination */}
      <EventsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Add event dialog */}
      <AddEventDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onEventAdded={() => {
          handleEventsUpdate()
          setAddOpen(false)
        }}
      />
    </div>
  )
}
