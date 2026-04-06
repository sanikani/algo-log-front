import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { deleteSolution } from '../../api/solutions'

export function useDeleteSolutionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSolution,
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: ['solutions'] })
      await queryClient.invalidateQueries({ queryKey: ['solution', String(id)] })
    },
  })
}
