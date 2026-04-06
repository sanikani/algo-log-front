import type { Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getSolutions } from '../../api/solutions'

export function useSolutionsQuery(enabled: Ref<boolean>) {
  return useQuery({
    queryKey: ['solutions'],
    queryFn: getSolutions,
    enabled,
    retry: false,
  })
}
