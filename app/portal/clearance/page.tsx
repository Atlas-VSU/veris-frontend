import { ShieldCheck, Check, Clock, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Progress } from "@/src/components/ui/progress"
import { currentStudentClearance } from "./mock-data"
import { cn } from "@/src/lib/utils"
import type { ClearanceItemStatus } from "./types"

const statusConfig: Record<ClearanceItemStatus, { icon: typeof Check; color: string; bgColor: string; iconBg: string }> = {
  cleared: { icon: Check, color: "text-success", bgColor: "border-success/20 bg-success/5", iconBg: "bg-success text-success-foreground" },
  pending: { icon: Clock, color: "text-warning-foreground", bgColor: "border-warning/20 bg-warning/5", iconBg: "bg-warning text-warning-foreground" },
  "not-cleared": { icon: X, color: "text-destructive", bgColor: "border-destructive/20 bg-destructive/5", iconBg: "bg-destructive/20 text-destructive" },
}

export default function PortalClearancePage() {
  const clearance = currentStudentClearance
  if (!clearance) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldCheck className="size-12 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">No Clearance Record</h2>
        <p className="mt-1 text-sm text-muted-foreground">No clearance record found for the current semester.</p>
      </div>
    )
  }

  const clearedCount = clearance.requirements.filter(r => r.status === "cleared").length
  const totalCount = clearance.requirements.length
  const progressPct = Math.round((clearedCount / totalCount) * 100)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Clearance</h1>
        <p className="text-sm text-muted-foreground">A.Y. {clearance.academicYear} -- {clearance.semester}</p>
      </div>

      {/* Overall Status Card */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex size-14 items-center justify-center rounded-full",
                clearance.overallStatus === "cleared" ? "bg-success/10" :
                  clearance.overallStatus === "not-cleared" ? "bg-destructive/10" : "bg-warning/10"
              )}>
                <ShieldCheck className={cn(
                  "size-7",
                  clearance.overallStatus === "cleared" ? "text-success" :
                    clearance.overallStatus === "not-cleared" ? "text-destructive" : "text-warning"
                )} />
              </div>
              <div>
                <h2 className="text-xl font-bold capitalize text-foreground">
                  {clearance.overallStatus.replace("-", " ")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {clearedCount} of {totalCount} requirements completed
                </p>
              </div>
            </div>
            <div className="w-full max-w-xs">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{progressPct}%</span>
              </div>
              <Progress value={progressPct} className="mt-1 h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Requirements</h3>
        {clearance.requirements.map(req => {
          const config = statusConfig[req.status]
          const Icon = config.icon
          return (
            <Card key={req.name} className={cn("border", config.bgColor)}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex size-8 items-center justify-center rounded-full", config.iconBg)}>
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{req.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{req.status.replace("-", " ")}</p>
                    </div>
                  </div>
                  <Badge
                    variant={req.status === "cleared" ? "secondary" : req.status === "not-cleared" ? "destructive" : "outline"}
                    className="capitalize"
                  >
                    {req.status.replace("-", " ")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
