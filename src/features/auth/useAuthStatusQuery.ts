import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getDashboardSummary } from '../../api/dashboard'
import { ApiError } from '../../types/api'

export function useAuthStatusQuery() {
  const query = useQuery({
    queryKey: ['auth-status'],
    queryFn: getDashboardSummary,
    retry: false,
  })

  const isAuthenticated = computed(() => query.isSuccess.value)
  const isUnauthorized = computed(
    () => query.error.value instanceof ApiError && query.error.value.status === 401,
  )

  return {
    ...query,
    isAuthenticated,
    isUnauthorized,
  }
}
