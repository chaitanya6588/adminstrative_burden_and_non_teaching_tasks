"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import Navigation from "@/components/navigation"
import StudentPerformanceDashboard from "@/components/student-performance-dashboard"
import MessagingSystem from "@/components/messaging-system"
import ScheduleManagement from "@/components/schedule-management"
import EvaluateComponent from "@/components/evaluate-component"
import EmailSystem from "@/components/email-system"
import RealtimeDashboard from "@/components/realtime-dashboard"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="flex flex-col gap-8 p-6 md:p-12 max-w-7xl mx-auto">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Educational Administration Dashboard</h1>
              <p className="text-muted-foreground">Manage student performance, communications, and scheduling</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">24</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">86%</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">92%</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">3</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="performance" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-secondary">
                <TabsTrigger value="performance" className="text-foreground">
                  Performance Trend
                </TabsTrigger>
                <TabsTrigger value="attendance" className="text-foreground">
                  Attendance
                </TabsTrigger>
                <TabsTrigger value="subjects" className="text-foreground">
                  Subject Distribution
                </TabsTrigger>
              </TabsList>

              <TabsContent value="performance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Performance Trend</CardTitle>
                    <CardDescription>Average scores across all students by subject</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        math: { label: "Math", color: "hsl(var(--chart-1))" },
                        english: { label: "English", color: "hsl(var(--chart-2))" },
                        science: { label: "Science", color: "hsl(var(--chart-3))" },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { subject: "Math", math: 85, english: 78, science: 92 },
                            { subject: "English", math: 92, english: 85, science: 88 },
                            { subject: "Science", math: 75, english: 82, science: 79 },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="subject" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="math" fill="var(--color-math)" />
                          <Bar dataKey="english" fill="var(--color-english)" />
                          <Bar dataKey="science" fill="var(--color-science)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attendance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Overview</CardTitle>
                    <CardDescription>Student attendance rate across sections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        present: { label: "Present", color: "hsl(var(--chart-1))" },
                        absent: { label: "Absent", color: "hsl(var(--chart-2))" },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Present", value: 92 },
                              { name: "Absent", value: 8 },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="hsl(var(--chart-1))" />
                            <Cell fill="hsl(var(--chart-2))" />
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subjects" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Subject Performance</CardTitle>
                    <CardDescription>Distribution of scores across subjects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        score: { label: "Average Score", color: "hsl(var(--chart-1))" },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { subject: "Math", score: 85 },
                            { subject: "English", score: 82 },
                            { subject: "Science", score: 85 },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="subject" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="score" stroke="var(--color-score)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeTab === "performance" && <StudentPerformanceDashboard />}
        {activeTab === "messaging" && <MessagingSystem />}
        {activeTab === "schedule" && <ScheduleManagement />}
        {activeTab === "evaluate" && <EvaluateComponent />}
        {activeTab === "email" && <EmailSystem />}
        {activeTab === "realtime" && <RealtimeDashboard />}
      </main>

      {/* Navigation Tab Buttons - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 flex gap-2 justify-center flex-wrap">
        <Button onClick={() => setActiveTab("dashboard")} variant={activeTab === "dashboard" ? "default" : "outline"}>
          Dashboard
        </Button>
        <Button
          onClick={() => setActiveTab("performance")}
          variant={activeTab === "performance" ? "default" : "outline"}
        >
          Performance
        </Button>
        <Button onClick={() => setActiveTab("messaging")} variant={activeTab === "messaging" ? "default" : "outline"}>
          Messages
        </Button>
        <Button onClick={() => setActiveTab("schedule")} variant={activeTab === "schedule" ? "default" : "outline"}>
          Schedule
        </Button>
        <Button onClick={() => setActiveTab("evaluate")} variant={activeTab === "evaluate" ? "default" : "outline"}>
          Evaluate
        </Button>
        <Button onClick={() => setActiveTab("email")} variant={activeTab === "email" ? "default" : "outline"}>
          Email
        </Button>
        <Button onClick={() => setActiveTab("realtime")} variant={activeTab === "realtime" ? "default" : "outline"}>
          Live Updates
        </Button>
      </div>
    </div>
  )
}
