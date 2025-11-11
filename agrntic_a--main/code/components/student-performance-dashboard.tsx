"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { students, performances, attendances } from "@/lib/data"
import StudentDetailsModal from "./student-details-modal"

export default function StudentPerformanceDashboard() {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [viewType, setViewType] = useState<"individual" | "section" | "subject">("individual")

  const getStudentPerformance = (studentId: string) => {
    return performances.filter((p) => p.studentId === studentId)
  }

  const getSectionPerformance = (section: string) => {
    const sectionStudents = students.filter((s) => s.section === section).map((s) => s.id)
    return performances.filter((p) => sectionStudents.includes(p.studentId))
  }

  const getSubjectPerformance = (subject: string) => {
    return performances.filter((p) => p.subject === subject)
  }

  const getAttendanceRate = (studentId: string) => {
    const studentAttendance = attendances.filter((a) => a.studentId === studentId)
    const presentDays = studentAttendance.filter((a) => a.present).length
    return Math.round((presentDays / studentAttendance.length) * 100)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Student Performance Analytics</h2>
        <p className="text-muted-foreground">View detailed performance metrics and analytics</p>
      </div>

      <Tabs defaultValue="individual" className="w-full" onValueChange={(v: any) => setViewType(v)}>
        <TabsList className="grid w-full grid-cols-3 bg-secondary">
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="section">Section-wise</TabsTrigger>
          <TabsTrigger value="subject">Subject-wise</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Student</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {students.map((student) => (
                    <Button
                      key={student.id}
                      onClick={() => setSelectedStudent(student.id)}
                      variant={selectedStudent === student.id ? "default" : "outline"}
                      className="w-full justify-start"
                    >
                      {student.name} ({student.registerNumber})
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedStudent && (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(() => {
                    const perf = getStudentPerformance(selectedStudent)
                    const avgScore = Math.round(
                      perf.reduce((a, b) => a + (b.score / b.maxScore) * 100, 0) / perf.length,
                    )
                    const student = students.find((s) => s.id === selectedStudent)
                    return (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground">Average Score</p>
                          <p className="text-2xl font-bold">{avgScore}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Attendance</p>
                          <p className="text-2xl font-bold">{getAttendanceRate(selectedStudent)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Subjects</p>
                          <p className="text-xl font-semibold">{[...new Set(perf.map((p) => p.subject))].join(", ")}</p>
                        </div>
                        <StudentDetailsModal
                          student={student!}
                          performance={perf}
                          attendance={attendances.filter((a) => a.studentId === selectedStudent)}
                        />
                      </>
                    )
                  })()}
                </CardContent>
              </Card>
            )}
          </div>

          {selectedStudent && (
            <Card>
              <CardHeader>
                <CardTitle>Performance by Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    score: { label: "Score %", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getStudentPerformance(selectedStudent).map((p) => ({
                        subject: p.subject,
                        score: Math.round((p.score / p.maxScore) * 100),
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="score" fill="hsl(var(--chart-1))" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="section" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["A", "B"].map((section) => {
              const sectionPerf = getSectionPerformance(section)
              const avgScore = Math.round(
                sectionPerf.reduce((a, b) => a + (b.score / b.maxScore) * 100, 0) / sectionPerf.length,
              )
              const sectionStudentCount = students.filter((s) => s.section === section).length

              return (
                <Card key={section}>
                  <CardHeader>
                    <CardTitle>Section {section}</CardTitle>
                    <CardDescription>{sectionStudentCount} students</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Average Performance</p>
                        <p className="text-3xl font-bold">{avgScore}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Score Distribution</p>
                        <ChartContainer
                          config={{
                            score: { label: "Score %", color: "hsl(var(--chart-1))" },
                          }}
                          className="h-[200px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={sectionPerf.reduce((acc: any[], curr) => {
                                const existing = acc.find((a) => a.subject === curr.subject)
                                if (existing) {
                                  existing.count += 1
                                  existing.totalScore += Math.round((curr.score / curr.maxScore) * 100)
                                } else {
                                  acc.push({
                                    subject: curr.subject,
                                    count: 1,
                                    totalScore: Math.round((curr.score / curr.maxScore) * 100),
                                  })
                                }
                                return acc
                              }, [])}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="subject" />
                              <YAxis />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Bar dataKey="totalScore" fill="hsl(var(--chart-1))" />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="subject" className="space-y-4">
          {["Math", "English", "Science"].map((subject) => {
            const subjectPerf = getSubjectPerformance(subject)
            const avgScore = Math.round(
              subjectPerf.reduce((a, b) => a + (b.score / b.maxScore) * 100, 0) / subjectPerf.length,
            )

            return (
              <Card key={subject}>
                <CardHeader>
                  <CardTitle>{subject}</CardTitle>
                  <CardDescription>Class average: {avgScore}%</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      score: { label: "Score %", color: "hsl(var(--chart-1))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={subjectPerf.map((p) => {
                          const student = students.find((s) => s.id === p.studentId)
                          return {
                            student: student?.registerNumber,
                            score: Math.round((p.score / p.maxScore) * 100),
                          }
                        })}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="student" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="score" fill="hsl(var(--chart-1))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}
