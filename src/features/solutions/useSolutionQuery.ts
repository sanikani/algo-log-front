import type { Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getSolution } from '../../api/solutions'

export function useSolutionQuery(id: string, enabled: Ref<boolean>) {
  return useQuery({
    queryKey: ['solution', id],
    queryFn: () => getSolution(id),
    enabled,
    retry: false,
  })
}
