"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Banknote,
  CalendarDays,
  AlertTriangle,
  ShieldCheck,
  BarChart3,
  Shield,
  LogOut,
  Menu,
  X,
  CreditCard,
} from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { Separator } from "@/src/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/src/components/ui/sheet"
import { useState } from "react"
import { ModeToggle } from "@/src/components/ui/mode-toggle"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Students",  href: "/admin/students",  icon: Users },
  { label: "Fees",      href: "/admin/fees",      icon: Banknote },
  { label: "Fines",     href: "/admin/fines",     icon: AlertTriangle },
  { label: "Payments",  href: "/admin/payments",  icon: CreditCard },
  { label: "Clearance", href: "/admin/clearance", icon: ShieldCheck },
  { label: "Events",    href: "/admin/events",    icon: CalendarDays },
  { label: "Reports",   href: "/admin/reports",   icon: BarChart3 },
]

function NavContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Shield className="size-4 text-sidebar-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none text-sidebar-foreground">Atlas</p>
          <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="flex flex-col gap-2 px-3 pb-4">
        <Separator className="bg-sidebar-border" />
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-full bg-sidebar-accent text-xs font-medium text-sidebar-accent-foreground">
              A
            </div>
            <span className="text-xs text-sidebar-foreground/70">Admin User</span>
          </div>
          <ModeToggle />
        </div>
        <Link href="/">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground">
            <LogOut className="size-4" />
            Sign Out
          </Button>
        </Link>
      </div>
    </div>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <NavContent pathname={pathname} />
      </aside>

      {/* Mobile header bar with hamburger */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background px-4 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="size-9">
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 bg-sidebar p-0 text-sidebar-foreground">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="absolute right-3 top-3 z-10">
              <Button variant="ghost" size="icon" className="size-8 text-sidebar-foreground/60 hover:text-sidebar-foreground" onClick={() => setOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
            <NavContent pathname={pathname} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Shield className="size-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">Atlas Admin</span>
        </div>
      </div>
    </>
  )
}
