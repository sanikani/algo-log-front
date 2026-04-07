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
  it('GitHub 로그인 랜딩 화면을 렌더링한다', async () => {
    router.push('/')
    await router.isReady()

    render(App, {
      global: {
        plugins: [router, VueQueryPlugin],
      },
    })

    expect(
      screen.getByRole('heading', {
        name: /풀어낸 문제를 학습 기록으로 남겨 다시 돌아보세요/i,
      }),
    ).toBeInTheDocument()
  })
})
