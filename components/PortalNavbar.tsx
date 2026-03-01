"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Menu, AlertTriangle, ShieldCheck, Banknote, CalendarDays, LayoutDashboard } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/src/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { ModeToggle } from "@/src/components/ui/mode-toggle"
import { currentStudent } from "@/app/portal/mock-data"
import { useState } from "react"

const navItems = [
  { label: "Dashboard", href: "/portal", icon: LayoutDashboard },
  { label: "Events", href: "/portal/events", icon: CalendarDays },
  { label: "Fees", href: "/portal/fees", icon: Banknote },
  { label: "Fines", href: "/portal/fines", icon: AlertTriangle },
  { label: "Clearance", href: "/portal/clearance", icon: ShieldCheck },
]

export function PortalNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-primary shadow-md shadow-primary/20" suppressHydrationWarning>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6">
          <Link href="/portal" className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-transparent">
              <img src="/ussc-logo-white.webp" alt="USSC Logo" className="h-auto" />
            </div>
            <span className="text-sm font-semibold text-primary-foreground">USSC Connect</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(item => {
              const isActive = item.href === "/portal" ? pathname === "/portal" : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-primary-foreground/70 hover:bg-white/15 hover:text-primary-foreground"
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
        <div className="flex items-center gap-3">
          <div className="[&>button]:border-white/20 [&>button]:bg-white/10 [&>button]:text-primary-foreground hover:[&>button]:bg-white/20">
            <ModeToggle />
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Avatar className="size-7">
              <AvatarFallback className="bg-white/20 text-xs font-semibold text-primary-foreground">
                {currentStudent.firstName[0]}{currentStudent.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs font-medium leading-none text-primary-foreground">
                {currentStudent.firstName} {currentStudent.lastName}
              </span>
              <span className="text-xs text-primary-foreground/60">{currentStudent.studentId}</span>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="hidden gap-1.5 text-primary-foreground/70 hover:bg-white/15 hover:text-primary-foreground sm:flex">
              <LogOut className="size-3.5" />
              Sign Out
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="size-8 text-primary-foreground hover:bg-white/15 hover:text-primary-foreground">
                <Menu className="size-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-4 pt-8">
                <div className="flex items-center gap-3 px-2">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
                      {currentStudent.firstName[0]}{currentStudent.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{currentStudent.firstName} {currentStudent.lastName}</p>
                    <p className="text-xs text-muted-foreground">{currentStudent.studentId}</p>
                  </div>
                </div>
                <nav className="flex flex-col gap-1">
                  {navItems.map(item => {
                    const isActive = item.href === "/portal" ? pathname === "/portal" : pathname.startsWith(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                        )}
                      >
                        <item.icon className="size-4" />
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>
                <Link href="/" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
                    <LogOut className="size-4" /> Sign Out
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
