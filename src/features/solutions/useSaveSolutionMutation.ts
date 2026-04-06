import { useMutation } from '@tanstack/vue-query'

import { createSolution, updateSolution } from '../../api/solutions'
import type { SolutionCreateRequest, SolutionUpdateRequest } from '../../types/api'

export function useCreateSolutionMutation() {
  return useMutation({
    mutationFn: (payload: SolutionCreateRequest) => createSolution(payload),
  })
}

export function useUpdateSolutionMutation(id: string) {
  return useMutation({
    mutationFn: (payload: SolutionUpdateRequest) => updateSolution(id, payload),
  })
}
