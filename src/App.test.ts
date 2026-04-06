import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import App from './App.vue'
import router from './router'

describe('App', () => {
  it('renders the bootstrap home page', async () => {
    router.push('/')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router],
      },
    })

    expect(screen.getByRole('heading', { name: /frontend workspace is ready/i })).toBeInTheDocument()
  })
})
