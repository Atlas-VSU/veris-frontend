"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Menu, AlertTriangle, ShieldCheck, Banknote, CalendarDays, LayoutDashboard } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/src/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { currentStudent } from "@/features/portal/mock-data"
import { useState } from "react"

const navItems = [
  { label: "Dashboard", href: "/portal-dashboard", icon: LayoutDashboard },
  { label: "Events",    href: "/portal-events",    icon: CalendarDays },
  { label: "Fees",      href: "/portal-fees",      icon: Banknote },
  { label: "Fines",     href: "/portal-fines",     icon: AlertTriangle },
  { label: "Clearance", href: "/portal-clearance",  icon: ShieldCheck },
]

export function PortalNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-[#E0E0E0] bg-white shadow-sm" suppressHydrationWarning>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-4 lg:gap-6">
          <Link href="/portal-dashboard" className="flex items-center gap-2 shrink-0">
            <div className="flex size-7 items-center justify-center rounded-md bg-transparent">
              <img src="/ussc-logo-1.webp" alt="USSC Logo" className="h-auto w-auto object-contain" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wide bg-linear-to-r from-[#8BC34A] via-[#2E7D32] to-[#1B5E20] bg-clip-text text-transparent">USSC Connect</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {navItems.map(item => {
              const isActive = item.href === "/portal-dashboard" ? pathname === "/portal-dashboard" : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                    isActive
                      ? "bg-[#8BC34A]/15 text-[#1B5E20] border border-[#8BC34A]/30"
                      : "text-[#616161] hover:bg-[#F5F5F5] hover:text-[#1B5E20]"
                  )}
                >
                  <item.icon className="size-3.5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right: User info + actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <Avatar className="size-7 border border-[#1B5E20]/20">
              <AvatarFallback className="bg-[#1B5E20] text-[10px] font-bold text-white">
                {currentStudent.firstName[0]}{currentStudent.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="hidden flex-col lg:flex">
              <span className="text-xs font-medium leading-none text-[#212121]">
                {currentStudent.firstName} {currentStudent.lastName}
              </span>
              <span className="text-[10px] text-[#616161]">{currentStudent.studentId}</span>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="hidden gap-1.5 text-[#616161] hover:bg-[#F5F5F5] hover:text-[#1B5E20] sm:flex">
              <LogOut className="size-3.5" />
              <span className="hidden lg:inline">Sign Out</span>
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="size-8 text-[#616161] hover:bg-[#F5F5F5] hover:text-[#1B5E20]">
                <Menu className="size-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-l-[#E0E0E0] bg-white p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col">
                {/* Mobile header */}
                <div className="flex items-center gap-3 border-b border-[#E0E0E0] bg-[#F5F5F5] px-4 py-5">
                  <Avatar className="size-10 border border-[#1B5E20]/20">
                    <AvatarFallback className="bg-[#1B5E20] text-sm font-bold text-white">
                      {currentStudent.firstName[0]}{currentStudent.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-[#212121]">{currentStudent.firstName} {currentStudent.lastName}</p>
                    <p className="text-xs text-[#616161]">{currentStudent.studentId}</p>
                  </div>
                </div>

                {/* Mobile nav links */}
                <nav className="flex flex-col gap-0.5 p-3">
                  {navItems.map(item => {
                    const isActive = item.href === "/portal-dashboard" ? pathname === "/portal-dashboard" : pathname.startsWith(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-[#8BC34A]/15 text-[#1B5E20] font-semibold border border-[#8BC34A]/30"
                            : "text-[#616161] hover:bg-[#F5F5F5] hover:text-[#1B5E20]"
                        )}
                      >
                        <item.icon className="size-4 shrink-0" />
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>

                {/* Mobile sign out */}
                <div className="mt-auto border-t border-[#E0E0E0] p-3">
                  <Link href="/" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-[#616161] hover:bg-[#F5F5F5] hover:text-[#1B5E20]">
                      <LogOut className="size-4" /> Sign Out
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
