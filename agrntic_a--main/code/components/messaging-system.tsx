"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { students } from "@/lib/data"

export default function MessagingSystem() {
  const messages = useAppStore((state) => state.messages)
  const addMessage = useAppStore((state) => state.addMessage)
  const [recipientType, setRecipientType] = useState<"student" | "parent">("student")
  const [selectedRecipient, setSelectedRecipient] = useState("")
  const [messageText, setMessageText] = useState("")
  const [studentName, setStudentName] = useState("")
  const [studentRegNum, setStudentRegNum] = useState("")

  const handleSendMessage = () => {
    if (messageText.trim() && selectedRecipient) {
      addMessage({
        id: Date.now().toString(),
        from: "Teacher",
        to: selectedRecipient,
        content: messageText,
        timestamp: new Date().toLocaleString(),
        read: false,
      })
      setMessageText("")
      setSelectedRecipient("")
    }
  }

  const handleSendParentNotification = () => {
    if (messageText.trim() && studentRegNum && studentName) {
      addMessage({
        id: Date.now().toString(),
        from: "Teacher",
        to: `Parent of ${studentName} (${studentRegNum})`,
        content: messageText,
        timestamp: new Date().toLocaleString(),
        read: false,
      })
      setMessageText("")
      setStudentName("")
      setStudentRegNum("")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Messaging System</h2>
        <p className="text-muted-foreground">Send messages to students and parent notifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Recipient Type</label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setRecipientType("student")}
                    variant={recipientType === "student" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                  >
                    Student
                  </Button>
                  <Button
                    onClick={() => setRecipientType("parent")}
                    variant={recipientType === "parent" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                  >
                    Parent
                  </Button>
                </div>
              </div>

              {recipientType === "student" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Student</label>
                  <select
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    value={selectedRecipient}
                    onChange={(e) => setSelectedRecipient(e.target.value)}
                  >
                    <option value="">Choose a student...</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.registerNumber}>
                        {s.name} ({s.registerNumber})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {recipientType === "parent" && (
                <div className="space-y-2">
                  <Input
                    placeholder="Student Name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                  <Input
                    placeholder="Student Register Number"
                    value={studentRegNum}
                    onChange={(e) => setStudentRegNum(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button
                onClick={recipientType === "student" ? handleSendMessage : handleSendParentNotification}
                className="w-full"
              >
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Message History</CardTitle>
              <CardDescription>Recent messages sent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No messages yet</p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="border border-border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="font-semibold">
                            {msg.from} → {msg.to}
                          </p>
                          <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
                        </div>
                        <Badge variant={msg.read ? "secondary" : "default"}>{msg.read ? "Read" : "Unread"}</Badge>
                      </div>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
