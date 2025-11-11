// Mock database - in production, connect to real database
export interface Student {
  id: string
  name: string
  registerNumber: string
  section: string
  email: string
}

export interface Performance {
  studentId: string
  subject: string
  score: number
  maxScore: number
  date: string
}

export interface Attendance {
  studentId: string
  date: string
  present: boolean
}

export interface Message {
  id: string
  from: string
  to: string
  content: string
  timestamp: string
  read: boolean
}

export interface Schedule {
  id: string
  title: string
  date: string
  time: string
  type: "meeting" | "class"
  studentIds?: string[]
  parentEmails?: string[]
  description?: string
}

export interface ExamPaper {
  id: string
  studentId: string
  studentName: string
  registerNumber: string
  questions: string[]
  answers: string[]
  evaluationStatus: "pending" | "evaluated"
  score?: number
  feedback?: string
}

// Mock data
export const students: Student[] = [
  { id: "1", name: "Raj Kumar", registerNumber: "S101", section: "A", email: "raj@school.com" },
  { id: "2", name: "Priya Singh", registerNumber: "S102", section: "A", email: "priya@school.com" },
  { id: "3", name: "Amit Sharma", registerNumber: "S103", section: "B", email: "amit@school.com" },
  { id: "4", name: "Anjali Patel", registerNumber: "S104", section: "B", email: "anjali@school.com" },
  { id: "5", name: "Vikram Singh", registerNumber: "S105", section: "A", email: "vikram@school.com" },
]

export const performances: Performance[] = [
  { studentId: "1", subject: "Math", score: 85, maxScore: 100, date: "2025-01-10" },
  { studentId: "1", subject: "English", score: 78, maxScore: 100, date: "2025-01-10" },
  { studentId: "1", subject: "Science", score: 92, maxScore: 100, date: "2025-01-10" },
  { studentId: "2", subject: "Math", score: 92, maxScore: 100, date: "2025-01-10" },
  { studentId: "2", subject: "English", score: 85, maxScore: 100, date: "2025-01-10" },
  { studentId: "2", subject: "Science", score: 88, maxScore: 100, date: "2025-01-10" },
  { studentId: "3", subject: "Math", score: 75, maxScore: 100, date: "2025-01-10" },
  { studentId: "3", subject: "English", score: 82, maxScore: 100, date: "2025-01-10" },
  { studentId: "3", subject: "Science", score: 79, maxScore: 100, date: "2025-01-10" },
  { studentId: "4", subject: "Math", score: 88, maxScore: 100, date: "2025-01-10" },
  { studentId: "4", subject: "English", score: 91, maxScore: 100, date: "2025-01-10" },
  { studentId: "4", subject: "Science", score: 85, maxScore: 100, date: "2025-01-10" },
]

export const attendances: Attendance[] = [
  { studentId: "1", date: "2025-01-08", present: true },
  { studentId: "1", date: "2025-01-09", present: true },
  { studentId: "1", date: "2025-01-10", present: false },
  { studentId: "2", date: "2025-01-08", present: true },
  { studentId: "2", date: "2025-01-09", present: true },
  { studentId: "2", date: "2025-01-10", present: true },
  { studentId: "3", date: "2025-01-08", present: false },
  { studentId: "3", date: "2025-01-09", present: true },
  { studentId: "3", date: "2025-01-10", present: true },
  { studentId: "4", date: "2025-01-08", present: true },
  { studentId: "4", date: "2025-01-09", present: false },
  { studentId: "4", date: "2025-01-10", present: true },
]

export const examPapers: ExamPaper[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "Raj Kumar",
    registerNumber: "S101",
    questions: ["What is the capital of India?", "Explain photosynthesis", "Solve: 2x + 5 = 15"],
    answers: ["New Delhi", "Process where plants convert sunlight to energy", "x = 5"],
    evaluationStatus: "pending",
  },
  {
    id: "2",
    studentId: "2",
    studentName: "Priya Singh",
    registerNumber: "S102",
    questions: ["What is the capital of India?", "Explain photosynthesis", "Solve: 2x + 5 = 15"],
    answers: ["New Delhi is the capital", "Green plants use sunlight energy", "x = 5"],
    evaluationStatus: "pending",
  },
]

export const messages: Message[] = [
  {
    id: "1",
    from: "Teacher",
    to: "S101",
    content: "Great work on the assignment!",
    timestamp: "2025-01-09 10:30",
    read: true,
  },
  {
    id: "2",
    from: "Teacher",
    to: "S102",
    content: "Please submit your project by Friday",
    timestamp: "2025-01-08 14:15",
    read: false,
  },
]
