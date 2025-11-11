"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { students, performances, attendances } from "@/lib/data"
import { useAppStore } from "@/lib/store"

interface EmailLog {
  id: string
  studentId: string
  studentName: string
  registerNumber: string
  parentEmail: string
  type: "performance" | "attendance"
  subject: string
  timestamp: string
  status: "sent" | "pending"
}

export default function EmailSystem() {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([])
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [emailType, setEmailType] = useState<"performance" | "attendance">("performance")
  const [parentEmail, setParentEmail] = useState("")
  const [sending, setSending] = useState(false)
  const addMessage = useAppStore((state) => state.addMessage)

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const generatePerformanceEmail = (student: any) => {
    const studentPerf = performances.filter((p) => p.studentId === student.id)
    const avgScore =
      studentPerf.length > 0
        ? Math.round(studentPerf.reduce((a, b) => a + (b.score / b.maxScore) * 100, 0) / studentPerf.length)
        : 0

    const subjects = studentPerf.map((p) => `${p.subject}: ${Math.round((p.score / p.maxScore) * 100)}%`).join(", ")

    return `
Dear Parent,

We are pleased to share ${student.name}'s academic performance report.

Performance Summary:
- Overall Average: ${avgScore}%
- Subject-wise Scores: ${subjects}
- Status: ${avgScore >= 75 ? "Excellent" : avgScore >= 60 ? "Good" : "Needs Improvement"}

Please feel free to contact us if you have any questions or concerns.

Best regards,
School Administration
    `.trim()
  }

  const generateAttendanceEmail = (student: any) => {
    const studentAttendance = attendances.filter((a) => a.studentId === student.id)
    const presentDays = studentAttendance.filter((a) => a.present).length
    const attendanceRate = studentAttendance.length > 0 ? Math.round((presentDays / studentAttendance.length) * 100) : 0

    return `
Dear Parent,

We are sharing ${student.name}'s attendance report for your review.

Attendance Summary:
- Present Days: ${presentDays} out of ${studentAttendance.length}
- Attendance Rate: ${attendanceRate}%
- Status: ${attendanceRate >= 85 ? "Good" : "Needs Attention"}

Regular attendance is crucial for academic success. Please ensure your child attends school regularly.

Best regards,
School Administration
    `.trim()
  }

  const handleSendEmails = async () => {
    if (selectedStudents.length === 0) return

    setSending(true)

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newLogs: EmailLog[] = []

    selectedStudents.forEach((studentId) => {
      const student = students.find((s) => s.id === studentId)
      if (student) {
        const email: EmailLog = {
          id: Date.now().toString() + studentId,
          studentId,
          studentName: student.name,
          registerNumber: student.registerNumber,
          parentEmail: parentEmail || student.email.replace("@school.com", "@parent.com"),
          type: emailType,
          subject:
            emailType === "performance" ? `Performance Report: ${student.name}` : `Attendance Report: ${student.name}`,
          timestamp: new Date().toLocaleString(),
          status: "sent",
        }

        newLogs.push(email)

        // Send notification via messaging system
        const emailContent =
          emailType === "performance" ? generatePerformanceEmail(student) : generateAttendanceEmail(student)

        addMessage({
          id: Date.now().toString() + studentId,
          from: "Email System",
          to: student.email.replace("@school.com", "@parent.com"),
          content: `[${emailType.toUpperCase()} EMAIL] ${email.subject}\n\n${emailContent}`,
          timestamp: new Date().toLocaleString(),
          read: false,
        })
      }
    })

    setEmailLogs([...emailLogs, ...newLogs])
    setSelectedStudents([])
    setSending(false)
  }

  const sentCount = emailLogs.filter((log) => log.status === "sent").length
  const pendingCount = emailLogs.filter((log) => log.status === "pending").length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Email System</h2>
        <p className="text-muted-foreground">Send performance and attendance reports to parents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Emails Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{sentCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Successful deliveries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Awaiting send</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {emailLogs.length > 0 ? Math.round((sentCount / emailLogs.length) * 100) : 0}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">of total emails</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setEmailType("performance")}
                    variant={emailType === "performance" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                  >
                    Performance
                  </Button>
                  <Button
                    onClick={() => setEmailType("attendance")}
                    variant={emailType === "attendance" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                  >
                    Attendance
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Parent Email (Optional)</label>
                <Input
                  placeholder="custom@parent.com"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  type="email"
                />
              </div>

              <Button onClick={handleSendEmails} className="w-full" disabled={selectedStudents.length === 0 || sending}>
                {sending
                  ? "Sending..."
                  : `Send to ${selectedStudents.length} Student${selectedStudents.length !== 1 ? "s" : ""}`}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Students</CardTitle>
              <CardDescription>Choose students to send reports to</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {students.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => handleToggleStudent(student.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedStudents.includes(student.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs opacity-75">{student.registerNumber}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedStudents.includes(student.id) ? "bg-current border-current" : "border-border"
                        }`}
                      >
                        {selectedStudents.includes(student.id) && <div className="w-2 h-2 bg-primary-foreground" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email History</CardTitle>
          <CardDescription>Recent emails sent to parents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {emailLogs.length === 0 ? (
              <p className="text-muted-foreground text-sm">No emails sent yet</p>
            ) : (
              emailLogs.map((log) => (
                <div key={log.id} className="border border-border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-semibold">{log.subject}</p>
                      <p className="text-xs text-muted-foreground">To: {log.parentEmail}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={log.type === "performance" ? "default" : "secondary"}>{log.type}</Badge>
                      {log.status === "sent" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
