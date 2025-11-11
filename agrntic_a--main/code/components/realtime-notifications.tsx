"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Bell } from "lucide-react"
import { useAppStore } from "@/lib/store"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: string
  read: boolean
}

export default function RealtimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const messages = useAppStore((state) => state.messages)

  useEffect(() => {
    // Convert messages to notifications
    const newNotifications: Notification[] = messages.map((msg) => ({
      id: msg.id,
      title: `Message from ${msg.from}`,
      message: msg.content.substring(0, 100),
      type: msg.read ? "info" : "success",
      timestamp: msg.timestamp,
      read: msg.read,
    }))

    setNotifications(newNotifications.slice(-5))
  }, [messages])

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-500 bg-green-50"
      case "warning":
        return "border-yellow-500 bg-yellow-50"
      case "error":
        return "border-red-500 bg-red-50"
      default:
        return "border-blue-500 bg-blue-50"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>System alerts and updates</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border-l-4 p-3 rounded flex items-start justify-between gap-2 ${getTypeColor(notification.type)}`}
              >
                <div>
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissNotification(notification.id)}
                  className="flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
