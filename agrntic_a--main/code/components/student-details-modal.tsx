"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type { Student, Performance, Attendance } from "@/lib/data"
import { useAppStore } from "@/lib/store"

interface StudentDetailsModalProps {
  student: Student
  performance: Performance[]
  attendance: Attendance[]
}

export default function StudentDetailsModal({ student, performance, attendance }: StudentDetailsModalProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const addMessage = useAppStore((state) => state.addMessage)

  const handleSendMessage = () => {
    if (message.trim()) {
      addMessage({
        id: Date.now().toString(),
        from: "Teacher",
        to: student.registerNumber,
        content: message,
        timestamp: new Date().toLocaleString(),
        read: false,
      })
      setMessage("")
      setTimeout(() => setOpen(false), 500)
    }
  }

  const attendanceRate = Math.round((attendance.filter((a) => a.present).length / attendance.length) * 100)
  const avgScore = Math.round(performance.reduce((a, b) => a + (b.score / b.maxScore) * 100, 0) / performance.length)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mt-4">View Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{student.name}</DialogTitle>
          <DialogDescription>
            {student.registerNumber} • Section {student.section}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {performance.map((p) => (
                <div key={p.subject} className="flex justify-between items-center">
                  <span>{p.subject}</span>
                  <span className="font-semibold">{Math.round((p.score / p.maxScore) * 100)}%</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between items-center font-bold">
                <span>Average</span>
                <span>{avgScore}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span>Attendance Rate</span>
                <span className="text-xl font-bold">{attendanceRate}%</span>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Present: {attendance.filter((a) => a.present).length} / {attendance.length} days
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Send Message</CardTitle>
              <CardDescription>Send a message to this student</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={handleSendMessage} className="w-full">
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
