"use client"

import RealtimeActivityFeed from "./realtime-activity-feed"
import RealtimeNotifications from "./realtime-notifications"
import DashboardMetrics from "./dashboard-metrics"

export default function RealtimeDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Real-time Dashboard</h2>
        <p className="text-muted-foreground">Live updates and system metrics</p>
      </div>

      <DashboardMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RealtimeActivityFeed />
        </div>
        <div className="lg:col-span-1">
          <RealtimeNotifications />
        </div>
      </div>
    </div>
  )
}
