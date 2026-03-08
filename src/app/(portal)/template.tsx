export default function PortalTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-enter">{children}</div>
}
