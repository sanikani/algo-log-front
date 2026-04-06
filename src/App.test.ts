import { render, screen } from '@testing-library/vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { describe, expect, it } from 'vitest'
import { vi } from 'vitest'

import App from './App.vue'
import router from './router'

vi.mock('./features/auth/useAuthStatusQuery', () => ({
  useAuthStatusQuery: () => ({
    isPending: { value: false },
    isAuthenticated: { value: false },
    isUnauthorized: { value: true },
  }),
}))

describe('App', () => {
  it('renders the GitHub login entry screen', async () => {
    router.push('/')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router, VueQueryPlugin],
      },
    })

    expect(
      screen.getByRole('heading', {
        name: /turn solved problems into a learning trail/i,
      }),
    ).toBeInTheDocument()
  })
})
