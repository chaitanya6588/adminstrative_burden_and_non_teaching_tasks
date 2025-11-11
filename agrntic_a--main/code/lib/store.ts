// Client-side store for real-time updates
import { create } from "zustand"
import type { Message, ExamPaper, Performance, Attendance } from "./data"

interface AppStore {
  messages: Message[]
  examPapers: ExamPaper[]
  performances: Performance[]
  attendances: Attendance[]

  addMessage: (message: Message) => void
  updateExamPaper: (paper: ExamPaper) => void
  updatePerformance: (performance: Performance) => void
  updateAttendance: (attendance: Attendance) => void
}

export const useAppStore = create<AppStore>((set) => ({
  messages: [],
  examPapers: [],
  performances: [],
  attendances: [],

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateExamPaper: (paper) =>
    set((state) => ({
      examPapers: state.examPapers.map((p) => (p.id === paper.id ? paper : p)),
    })),

  updatePerformance: (performance) =>
    set((state) => ({
      performances: [...state.performances, performance],
    })),

  updateAttendance: (attendance) =>
    set((state) => ({
      attendances: [...state.attendances, attendance],
    })),
}))
