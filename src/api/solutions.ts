import { http } from './http'
import type {
  ApiResponse,
  Solution,
  SolutionCreateRequest,
  SolutionUpdateRequest,
} from '../types/api'

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

export async function createSolution(payload: SolutionCreateRequest): Promise<Solution> {
  const response = await http.post<ApiResponse<Solution>>('/api/v1/solutions', payload)
  return response.data.data
}

export async function updateSolution(
  id: string | number,
  payload: SolutionUpdateRequest,
): Promise<Solution> {
  const response = await http.put<ApiResponse<Solution>>(`/api/v1/solutions/${id}`, payload)
  return response.data.data
}
