"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Banknote,
  CalendarDays,
  AlertTriangle,
  ShieldCheck,
  BarChart3,
  LogOut,
  Menu,
  X,
  CreditCard,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { Separator } from "@/src/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/src/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip"
import { useState } from "react"
import { ModeToggle } from "@/src/components/ui/mode-toggle"

const navItems = [
  { label: "Dashboard", href: "/admin",           icon: LayoutDashboard },
  { label: "Students",  href: "/admin/students",  icon: Users },
  { label: "Events",    href: "/admin/events",    icon: CalendarDays },
  { label: "Fees",      href: "/admin/fees",      icon: Banknote },
  { label: "Fines",     href: "/admin/fines",     icon: AlertTriangle },
  { label: "Payments",  href: "/admin/payments",  icon: CreditCard },
  { label: "Clearance", href: "/admin/clearance", icon: ShieldCheck },
  { label: "Analytics", href: "/admin/reports",   icon: BarChart3 },
]

function isActiveHref(href: string, pathname: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)
}

function NavContent({
  pathname,
  collapsed = false,
  onNavigate,
}: {
  pathname: string
  collapsed?: boolean
  onNavigate?: () => void
}) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-full flex-col overflow-hidden">
        {/* Logo */}
        <div className={cn(
          "flex items-center gap-3 px-4 py-5 shrink-0",
          collapsed && "justify-center px-0"
        )}>
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg">
            <Image src="/ussc-logo-white.webp" alt="USSC Logo" width={32} height={32} className="h-8 w-8 object-contain" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-none text-sidebar-foreground">USSC Connect</p>
              <p className="truncate text-xs text-sidebar-foreground/50 mt-0.5">Admin Panel</p>
            </div>
          )}
        </div>

        <Separator className="bg-sidebar-border shrink-0" />

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = isActiveHref(item.href, pathname)
            const linkEl = (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                  collapsed && "justify-center px-0 size-10 mx-auto",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-sidebar-primary" />
                )}
                <item.icon className={cn("size-4 shrink-0", active && "text-sidebar-primary")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return linkEl
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0">
          <Separator className="bg-sidebar-border" />
          <div className={cn(
            "flex flex-col gap-1 px-3 py-3",
            collapsed && "items-center px-0"
          )}>
            {/* User info */}
            <div className={cn(
              "flex items-center gap-2.5 rounded-md px-2 py-1.5",
              !collapsed && "hover:bg-sidebar-accent/40 transition-colors"
            )}>
              <Avatar className="size-7 shrink-0">
                <AvatarFallback className="bg-sidebar-primary/20 text-xs font-semibold text-sidebar-primary-foreground">
                  AD
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-sidebar-foreground">Admin User</p>
                  <p className="truncate text-[10px] text-sidebar-foreground/50">admin@ussc.edu.ph</p>
                </div>
              )}
              {!collapsed && <ModeToggle />}
            </div>
            {collapsed && (
              <div className="mt-1">
                <ModeToggle />
              </div>
            )}
            {/* Sign out */}
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 text-sidebar-foreground/50 hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Sign out"
                    >
                      <LogOut className="size-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Sign Out</TooltipContent>
              </Tooltip>
            ) : (
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-sidebar-foreground/50 hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // Get current page label for mobile header
  const allItems = navItems
  const currentItem = allItems.find(i => isActiveHref(i.href, pathname))

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden shrink-0 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col transition-[width] duration-200 ease-in-out relative sticky top-0 h-svh",
          collapsed ? "w-15" : "w-60"
        )}
      >
        <NavContent pathname={pathname} collapsed={collapsed} />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(v => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "absolute -right-3 top-18 z-10 flex size-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground/60 shadow-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
          )}
        >
          {collapsed
            ? <PanelLeftOpen className="size-3" />
            : <PanelLeftClose className="size-3" />
          }
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/95 backdrop-blur px-4 lg:hidden" suppressHydrationWarning>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="size-9 shrink-0">
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 bg-sidebar p-0 text-sidebar-foreground border-r border-sidebar-border">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="absolute right-3 top-3 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
            <NavContent pathname={pathname} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Logo + current page */}
        <div className="flex items-center gap-2 min-w-0">
          <Image src="/ussc-logo-white.webp" alt="USSC Logo" width={24} height={24} className="size-6 object-contain shrink-0 invert dark:invert-0" />
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-semibold text-foreground shrink-0">USSC Connect</span>
            {currentItem && (
              <>
                <span className="text-muted-foreground/40 shrink-0">/</span>
                <span className="truncate text-sm text-muted-foreground">{currentItem.label}</span>
              </>
            )}
          </div>
        </div>

        <div className="ml-auto">
          <ModeToggle />
        </div>
      </div>
    </>
  )
}
