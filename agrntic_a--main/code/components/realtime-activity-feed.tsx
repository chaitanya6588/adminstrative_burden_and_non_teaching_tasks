"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, MessageSquare, FileCheck, Clock, Mail, TrendingUp } from "lucide-react"
import { useAppStore } from "@/lib/store"

export interface ActivityEvent {
  id: string
  type: "message" | "evaluation" | "schedule" | "email" | "performance" | "attendance"
  title: string
  description: string
  timestamp: string
  icon: React.ReactNode
  color: string
}

export default function RealtimeActivityFeed() {
  const [activities, setActivities] = useState<ActivityEvent[]>([])
  const messages = useAppStore((state) => state.messages)
  const examPapers = useAppStore((state) => state.examPapers)
  const performances = useAppStore((state) => state.performances)

  useEffect(() => {
    // Generate activity events from store data
    const events: ActivityEvent[] = []

    // Add message events
    messages.slice(-5).forEach((msg) => {
      events.push({
        id: `msg-${msg.id}`,
        type: "message",
        title: "New Message",
        description: `${msg.from} → ${msg.to}: ${msg.content.substring(0, 50)}...`,
        timestamp: msg.timestamp,
        icon: <MessageSquare className="w-4 h-4" />,
        color: "bg-blue-100 text-blue-700",
      })
    })

    // Add evaluation events
    examPapers
      .filter((p) => p.evaluationStatus === "evaluated")
      .slice(-3)
      .forEach((paper) => {
        events.push({
          id: `eval-${paper.id}`,
          type: "evaluation",
          title: "Paper Evaluated",
          description: `${paper.studentName}'s exam has been evaluated`,
          timestamp: new Date().toLocaleString(),
          icon: <FileCheck className="w-4 h-4" />,
          color: "bg-green-100 text-green-700",
        })
      })

    // Add performance events
    performances.slice(-3).forEach((perf) => {
      events.push({
        id: `perf-${perf.studentId}-${perf.subject}`,
        type: "performance",
        title: "Performance Updated",
        description: `${perf.subject}: ${Math.round((perf.score / perf.maxScore) * 100)}%`,
        timestamp: perf.date,
        icon: <TrendingUp className="w-4 h-4" />,
        color: "bg-purple-100 text-purple-700",
      })
    })

    // Sort by most recent and take top 10
    const sortedEvents = events
      .sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime()
        const timeB = new Date(b.timestamp).getTime()
        return timeB - timeA
      })
      .slice(0, 10)

    setActivities(sortedEvents)
  }, [messages, examPapers, performances])

  const getEventIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-4 h-4" />
      case "evaluation":
        return <FileCheck className="w-4 h-4" />
      case "schedule":
        return <Clock className="w-4 h-4" />
      case "email":
        return <Mail className="w-4 h-4" />
      case "performance":
        return <TrendingUp className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "message":
        return "bg-blue-100 text-blue-700"
      case "evaluation":
        return "bg-green-100 text-green-700"
      case "schedule":
        return "bg-orange-100 text-orange-700"
      case "email":
        return "bg-indigo-100 text-indigo-700"
      case "performance":
        return "bg-purple-100 text-purple-700"
      case "attendance":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <div>
            <CardTitle>Live Activity Feed</CardTitle>
            <CardDescription>Real-time system updates and events</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recent activities</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-3 p-3 border border-border rounded-lg hover:bg-secondary transition-colors"
              >
                <div className={`p-2 rounded-full ${getEventColor(activity.type)} flex-shrink-0`}>
                  {getEventIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{activity.description}</p>
                    </div>
                    <Badge variant="outline" className="flex-shrink-0 text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{activity.timestamp}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
