import { AdminSidebar } from "@/components/layout/AdminSidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh items-start">
      <AdminSidebar />
      <main className="admin-bg flex-1 overflow-auto pt-14 lg:pt-0 min-h-svh">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
