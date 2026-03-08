import { PortalNavbar } from "@/components/layout/PortalNavbar"

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="portal-bg min-h-svh" suppressHydrationWarning>
      <PortalNavbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
 