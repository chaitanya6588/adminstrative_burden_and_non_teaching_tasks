"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { examPapers } from "@/lib/data"
import { useAppStore } from "@/lib/store"

interface EvaluatedPaper {
  id: string
  studentId: string
  studentName: string
  registerNumber: string
  score: number
  maxScore: number
  feedback: string
  timestamp: string
}

export default function EvaluateComponent() {
  const [papers, setPapers] = useState(examPapers)
  const [evaluatedPapers, setEvaluatedPapers] = useState<EvaluatedPaper[]>([])
  const [selectedPaper, setSelectedPaper] = useState<any>(null)
  const [evaluating, setEvaluating] = useState(false)
  const updateExamPaper = useAppStore((state) => state.updateExamPaper)
  const updatePerformance = useAppStore((state) => state.updatePerformance)
  const addMessage = useAppStore((state) => state.addMessage)

  const handleEvaluatePaper = async (paper: any) => {
    setEvaluating(true)
    setSelectedPaper(paper)

    // Simulate AI evaluation with delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate mock evaluation
    const score = Math.floor(Math.random() * 30) + 70
    const feedbackOptions = [
      "Excellent understanding of concepts. Great job!",
      "Good attempt. Could improve on clarity of explanations.",
      "Shows promise. Review the key concepts and try again.",
      "Strong fundamentals. Keep practicing for improvement.",
      "Satisfactory. Work on detailed explanations.",
    ]
    const feedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)]

    const evaluatedPaper: EvaluatedPaper = {
      id: paper.id,
      studentId: paper.studentId,
      studentName: paper.studentName,
      registerNumber: paper.registerNumber,
      score: score,
      maxScore: 100,
      feedback: feedback,
      timestamp: new Date().toLocaleString(),
    }

    // Update papers list
    setPapers(papers.map((p) => (p.id === paper.id ? { ...p, evaluationStatus: "evaluated" } : p)))
    setEvaluatedPapers([...evaluatedPapers, evaluatedPaper])

    // Update performance in store (real-time update)
    updatePerformance({
      studentId: paper.studentId,
      subject: "Assessment",
      score: score,
      maxScore: 100,
      date: new Date().toISOString().split("T")[0],
    })

    // Send message to student
    addMessage({
      id: Date.now().toString(),
      from: "AI Evaluator",
      to: paper.registerNumber,
      content: `Your exam has been evaluated! Score: ${score}/100. Feedback: ${feedback}`,
      timestamp: new Date().toLocaleString(),
      read: false,
    })

    setSelectedPaper(null)
    setEvaluating(false)
  }

  const pendingPapers = papers.filter((p) => p.evaluationStatus === "pending")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">AI Exam Evaluation</h2>
        <p className="text-muted-foreground">
          Evaluate student exam papers using AI and get real-time dashboard updates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Papers</CardTitle>
              <CardDescription>{pendingPapers.length} papers to evaluate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {pendingPapers.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No pending papers</p>
                ) : (
                  pendingPapers.map((paper) => (
                    <Button
                      key={paper.id}
                      onClick={() => setSelectedPaper(paper)}
                      variant={selectedPaper?.id === paper.id ? "default" : "outline"}
                      className="w-full justify-start"
                      disabled={evaluating}
                    >
                      <div className="text-left w-full">
                        <p className="font-medium">{paper.studentName}</p>
                        <p className="text-xs text-muted-foreground">{paper.registerNumber}</p>
                      </div>
                    </Button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {selectedPaper ? (
            <Card>
              <CardHeader>
                <CardTitle>Exam Paper</CardTitle>
                <CardDescription>
                  {selectedPaper.studentName} ({selectedPaper.registerNumber})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Questions & Answers</h3>
                  <div className="space-y-4">
                    {selectedPaper.questions.map((question: string, index: number) => (
                      <div key={index} className="border border-border rounded-lg p-3 space-y-2">
                        <p className="font-medium">
                          Q{index + 1}: {question}
                        </p>
                        <p className="text-sm text-muted-foreground bg-secondary p-2 rounded">
                          <strong>Answer:</strong> {selectedPaper.answers[index]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={() => handleEvaluatePaper(selectedPaper)} className="w-full" disabled={evaluating}>
                  {evaluating ? "Evaluating with AI..." : "Evaluate with AI"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-12 pb-12">
                <p className="text-center text-muted-foreground">Select a paper to evaluate</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Evaluation Results</CardTitle>
              <CardDescription>Real-time updates sent to student dashboards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {evaluatedPapers.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No evaluations yet</p>
                ) : (
                  evaluatedPapers.map((paper) => (
                    <div key={paper.id} className="border border-border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{paper.studentName}</p>
                          <p className="text-xs text-muted-foreground">{paper.registerNumber}</p>
                        </div>
                        <Badge>{paper.score}/100</Badge>
                      </div>
                      <p className="text-sm">{paper.feedback}</p>
                      <p className="text-xs text-muted-foreground">{paper.timestamp}</p>
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
