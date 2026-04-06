import { http } from './http'
import type { ApiResponse, DashboardSummary } from '../types/api'

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await http.get<ApiResponse<DashboardSummary>>('/api/v1/dashboard/summary')
  return response.data.data
}
