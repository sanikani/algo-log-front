import { render, screen } from '@testing-library/vue'
import { defineComponent, h, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const replaceSpy = vi.fn()

const authState = {
  isPending: ref(false),
  isAuthenticated: ref(true),
  isUnauthorized: ref(false),
  data: ref({
    totalCount: 12,
    solvedCount: 9,
    failedCount: 3,
    platformCounts: [
      { name: 'Baekjoon', count: 8 },
      { name: 'Programmers', count: 4 },
    ],
    difficultyCounts: [
      { name: 'Silver', count: 7 },
      { name: 'Gold', count: 5 },
    ],
  }),
}

const heatmapState = {
  isLoading: ref(false),
  isError: ref(false),
  data: ref([]),
}

vi.mock('vue-router', () => ({
  RouterLink: defineComponent({
    name: 'RouterLink',
    props: {
      to: {
        type: [String, Object],
        required: false,
        default: '/',
      },
    },
    setup(props, { attrs, slots }) {
      return () =>
        h('a', { ...attrs, href: typeof props.to === 'string' ? props.to : '/' }, slots.default?.())
    },
  }),
  useRouter: () => ({
    replace: replaceSpy,
  }),
}))

vi.mock('../features/auth/auth', () => ({
  getLogoutUrl: () => '/logout',
}))

vi.mock('../features/auth/useAuthStatusQuery', () => ({
  useAuthStatusQuery: () => authState,
}))

vi.mock('../features/dashboard/useDashboardHeatmapQuery', () => ({
  useDashboardHeatmapQuery: () => heatmapState,
}))

import DashboardPage from './DashboardPage.vue'

describe('DashboardPage', () => {
  beforeEach(() => {
    replaceSpy.mockReset()
    authState.isPending.value = false
    authState.isAuthenticated.value = true
    authState.isUnauthorized.value = false
  })

  it('shows signed-in arrival guidance with primary and secondary actions', () => {
    render(DashboardPage)

    expect(screen.getByText(/signed in with your current github session/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /write a note/i })).toHaveAttribute('href', '/problems/new')
    expect(screen.getByRole('link', { name: /browse problem list/i })).toHaveAttribute('href', '/problems')
  })

  it('redirects unauthorized visitors back to the home page', () => {
    authState.isAuthenticated.value = false
    authState.isUnauthorized.value = true

    render(DashboardPage)

    expect(replaceSpy).toHaveBeenCalledWith('/')
  })
})
