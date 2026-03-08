"use client"

import { useState, useCallback, useMemo } from "react"
import type { Event, EventStatus } from "../types"

export function useEventsFiltering(allEvents: Event[]) {
  const [searchQuery, setSearchQuery] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [sortBy, setSortBy] = useState<string>("date-desc")
  const [currentTab, setCurrentTab] = useState<EventStatus | "all">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      const tabMatch = currentTab === "all" || event.status === currentTab
      const searchMatch =
        !searchQuery ||
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      const dateMatch =
        !date || new Date(event.date).toDateString() === date.toDateString()
      return tabMatch && searchMatch && dateMatch
    })
  }, [allEvents, currentTab, searchQuery, date])

  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "attendees-asc":
          return a.attendees - b.attendees
        case "attendees-desc":
          return b.attendees - a.attendees
        default:
          return 0
      }
    })
  }, [filteredEvents, sortBy])

  const totalPages = Math.max(1, Math.ceil(sortedEvents.length / itemsPerPage))

  const paginatedEvents = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages)
    return sortedEvents.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage)
  }, [sortedEvents, currentPage, totalPages])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }, [])

  const setDateFilter = useCallback((newDate: Date | undefined) => {
    setDate(newDate)
    setCurrentPage(1)
  }, [])

  const setSortByFilter = useCallback((newSortBy: string) => {
    setSortBy(newSortBy)
    setCurrentPage(1)
  }, [])

  const handleTabChange = useCallback((tab: EventStatus | "all") => {
    setCurrentTab(tab)
    setCurrentPage(1)
  }, [])

  return {
    searchQuery,
    date,
    sortBy,
    currentTab,
    currentPage,
    totalPages,
    filteredEvents,
    sortedEvents,
    paginatedEvents,
    handleSearch,
    setDateFilter,
    setSortByFilter,
    handleTabChange,
    setCurrentPage,
  }
}
