import type { Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getDashboardHeatmap } from '../../api/dashboard'

export function useDashboardHeatmapQuery(enabled: Ref<boolean>) {
  return useQuery({
    queryKey: ['dashboard-heatmap'],
    queryFn: getDashboardHeatmap,
    enabled,
    retry: false,
  })
}
