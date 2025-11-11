"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"

interface ScheduleItem {
  id: string
  title: string
  date: string
  time: string
  type: "meeting" | "class"
  studentNames: string[]
  parentEmails: string[]
  description: string
}

export default function ScheduleManagement() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([])
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [type, setType] = useState<"meeting" | "class">("meeting")
  const [studentNames, setStudentNames] = useState("")
  const [parentEmails, setParentEmails] = useState("")
  const [description, setDescription] = useState("")
  const addMessage = useAppStore((state) => state.addMessage)

  const handleSchedule = () => {
    if (title && date && time) {
      const newSchedule: ScheduleItem = {
        id: Date.now().toString(),
        title,
        date,
        time,
        type,
        studentNames: studentNames.split(",").filter((s) => s.trim()),
        parentEmails: parentEmails.split(",").filter((e) => e.trim()),
        description,
      }

      setSchedules([...schedules, newSchedule])

      // Send notifications to parents if it's a parent meeting
      if (type === "meeting" && parentEmails) {
        addMessage({
          id: Date.now().toString(),
          from: "School",
          to: parentEmails,
          content: `Meeting scheduled: ${title} on ${date} at ${time}. Students: ${studentNames}. ${description}`,
          timestamp: new Date().toLocaleString(),
          read: false,
        })
      }

      // Reset form
      setTitle("")
      setDate("")
      setTime("")
      setDescription("")
      setStudentNames("")
      setParentEmails("")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Schedule Management</h2>
        <p className="text-muted-foreground">Create and manage class schedules and parent meetings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Schedule</CardTitle>
            <CardDescription>Add new class or meeting schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="e.g., Parent-Teacher Meeting"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setType("class")}
                  variant={type === "class" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                >
                  Class
                </Button>
                <Button
                  onClick={() => setType("meeting")}
                  variant={type === "meeting" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                >
                  Meeting
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            </div>

            {type === "meeting" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Student Names (comma separated)</label>
                  <Input
                    placeholder="e.g., Raj Kumar, Priya Singh"
                    value={studentNames}
                    onChange={(e) => setStudentNames(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Parent Emails (comma separated)</label>
                  <Input
                    placeholder="e.g., parent1@email.com, parent2@email.com"
                    value={parentEmails}
                    onChange={(e) => setParentEmails(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Add any additional details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <Button onClick={handleSchedule} className="w-full">
              Schedule
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scheduled Items</CardTitle>
            <CardDescription>Upcoming schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {schedules.length === 0 ? (
                <p className="text-muted-foreground text-sm">No schedules yet</p>
              ) : (
                schedules.map((schedule) => (
                  <div key={schedule.id} className="border border-border rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-semibold">{schedule.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {schedule.date} at {schedule.time}
                        </p>
                      </div>
                      <Badge variant={schedule.type === "meeting" ? "default" : "secondary"}>{schedule.type}</Badge>
                    </div>
                    {schedule.studentNames.length > 0 && (
                      <p className="text-sm">Students: {schedule.studentNames.join(", ")}</p>
                    )}
                    {schedule.description && <p className="text-sm text-muted-foreground">{schedule.description}</p>}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
