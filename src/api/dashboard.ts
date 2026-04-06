import { http } from './http'
import type { ApiResponse, DashboardSummary, HeatmapDay } from '../types/api'

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await http.get<ApiResponse<DashboardSummary>>('/api/v1/dashboard/summary')
  return response.data.data
}

export async function getDashboardHeatmap(): Promise<HeatmapDay[]> {
  const response = await http.get<ApiResponse<HeatmapDay[]>>('/api/v1/dashboard/heatmap')
  return response.data.data
}
