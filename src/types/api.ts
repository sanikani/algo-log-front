export interface ApiResponse<T> {
  status: number
  code: string
  message: string
  data: T
}

export interface FieldErrorDetail {
  field: string
  reason: string
  rejectedValue: unknown
}

export class ApiError extends Error {
  status: number
  code: string
  details?: FieldErrorDetail[]

  constructor(status: number, code: string, message: string, details?: FieldErrorDetail[]) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export interface DashboardCount {
  name: string
  count: number
}

export interface Problem {
  id: number
  platform: string
  externalProblemId: string
  title: string
  problemUrl: string
  difficulty: string
}

export interface Solution {
  id: number
  code: string
  timeElapsed: number
  solved: boolean
  memoMarkdown: string
  problem: Problem
  memberId: number
  createdAt: string
  updatedAt: string
}

export interface DashboardSummary {
  totalCount: number
  solvedCount: number
  failedCount: number
  platformCounts: DashboardCount[]
  difficultyCounts: DashboardCount[]
}

export interface HeatmapDay {
  date: string
  solvedCount: number
}
