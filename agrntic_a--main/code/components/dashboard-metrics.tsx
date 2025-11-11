"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { performances, attendances, examPapers, messages } from "@/lib/data"
import { useAppStore } from "@/lib/store"

interface MetricCard {
  title: string
  value: string | number
  change: string
  icon: React.ReactNode
  color: string
}

export default function DashboardMetrics() {
  const [metrics, setMetrics] = useState<MetricCard[]>([])
  const storeMessages = useAppStore((state) => state.messages)
  const storePapers = useAppStore((state) => state.examPapers)
  const storePerformances = useAppStore((state) => state.performances)

  useEffect(() => {
    // Calculate real-time metrics
    const allMessages = [...messages, ...storeMessages]
    const unreadMessages = allMessages.filter((m) => !m.read).length

    const allPapers = [...examPapers, ...storePapers]
    const evaluatedPapers = allPapers.filter((p) => p.evaluationStatus === "evaluated").length
    const pendingPapers = allPapers.filter((p) => p.evaluationStatus === "pending").length

    const allPerformances = [...performances, ...storePerformances]
    const avgScore =
      allPerformances.length > 0
        ? Math.round(allPerformances.reduce((a, b) => a + (b.score / b.maxScore) * 100, 0) / allPerformances.length)
        : 0

    const presentCount = attendances.filter((a) => a.present).length
    const attendanceRate = attendances.length > 0 ? Math.round((presentCount / attendances.length) * 100) : 0

    const newMetrics: MetricCard[] = [
      {
        title: "Messages",
        value: unreadMessages,
        change: `${allMessages.length} total`,
        icon: <TrendingUp className="w-4 h-4" />,
        color: "bg-blue-50 text-blue-600",
      },
      {
        title: "Evaluations",
        value: evaluatedPapers,
        change: `${pendingPapers} pending`,
        icon: <TrendingUp className="w-4 h-4" />,
        color: "bg-green-50 text-green-600",
      },
      {
        title: "Avg Performance",
        value: `${avgScore}%`,
        change: `${allPerformances.length} records`,
        icon: <TrendingUp className="w-4 h-4" />,
        color: "bg-purple-50 text-purple-600",
      },
      {
        title: "Attendance",
        value: `${attendanceRate}%`,
        change: `${presentCount} present`,
        icon: <TrendingUp className="w-4 h-4" />,
        color: "bg-orange-50 text-orange-600",
      },
    ]

    setMetrics(newMetrics)
  }, [storeMessages, storePapers, storePerformances])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className={`${metric.color} border-0`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {metric.title}
              {metric.icon}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metric.value}</p>
            <p className="text-xs mt-1 opacity-75">{metric.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
