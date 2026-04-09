import { render, screen, waitFor } from '@testing-library/vue'
import { defineComponent, h, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const replaceSpy = vi.fn()

const authState = {
  isPending: ref(false),
  isAuthenticated: ref(false),
  isUnauthorized: ref(true),
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
    setup(props, { slots }) {
      return () => h('a', { href: typeof props.to === 'string' ? props.to : '/' }, slots.default?.())
    },
  }),
  useRouter: () => ({
    replace: replaceSpy,
  }),
}))

vi.mock('../features/auth/auth', () => ({
  getGithubLoginUrl: () => '/oauth2/authorization/github',
}))

vi.mock('../features/auth/useAuthStatusQuery', () => ({
  useAuthStatusQuery: () => authState,
}))

import HomePage from './HomePage.vue'

describe('HomePage', () => {
  beforeEach(() => {
    replaceSpy.mockReset()
    authState.isPending.value = false
    authState.isAuthenticated.value = false
    authState.isUnauthorized.value = true
  })

  it('explains the product in user-facing language', () => {
    render(HomePage)

    expect(
      screen.getByText(/review past notes, capture a fresh solution, and keep your practice history in one place/i),
    ).toBeInTheDocument()
  })

  it('redirects authenticated visitors to the dashboard', async () => {
    authState.isAuthenticated.value = true
    authState.isUnauthorized.value = false

    render(HomePage)

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenCalledWith('/dashboard')
    })
  })
})
