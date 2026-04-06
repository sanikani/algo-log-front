import { http } from './http'
import type { ApiResponse, Solution } from '../types/api'

export async function getSolutions(): Promise<Solution[]> {
  const response = await http.get<ApiResponse<Solution[]>>('/api/v1/solutions')
  return response.data.data
}

export async function getSolution(id: string | number): Promise<Solution> {
  const response = await http.get<ApiResponse<Solution>>(`/api/v1/solutions/${id}`)
  return response.data.data
}

export async function deleteSolution(id: string | number): Promise<void> {
  await http.delete(`/api/v1/solutions/${id}`)
}
