<template>
  <main class="landing-page">
    <section class="landing-panel">
      <p class="eyebrow">
        AlgoLog 작업 공간
      </p>
      <h1>
        풀어낸 문제를 학습 기록으로 남겨 다시 돌아보세요.
      </h1>
      <p class="lead">
        기존 Spring 백엔드에 GitHub OAuth 세션 인증이 연결되어 있습니다. GitHub로
        진입하면 대시보드에서 세션 상태를 한눈에 확인할 수 있습니다.
      </p>

      <div class="landing-actions">
        <a
          class="primary-button"
          :href="githubLoginUrl"
        >
          GitHub로 계속하기
        </a>
        <RouterLink
          class="secondary-button"
          to="/dashboard"
        >
          현재 세션 확인하기
        </RouterLink>
      </div>

      <div class="status-grid">
        <article class="status-card">
          <span>인증 상태 확인</span>
          <strong>{{ authMessage }}</strong>
        </article>
        <article class="status-card">
          <span>보호된 경로</span>
          <strong>/dashboard, /problems</strong>
        </article>
        <article class="status-card">
          <span>실행 모드</span>
          <strong>자격 증명 기반 API 클라이언트</strong>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { getGithubLoginUrl } from '../features/auth/auth'
import { useAuthStatusQuery } from '../features/auth/useAuthStatusQuery'

const githubLoginUrl = getGithubLoginUrl()
const authQuery = useAuthStatusQuery()

const authMessage = computed(() => {
  if (authQuery.isPending.value) {
    return '세션을 확인하는 중...'
  }

  if (authQuery.isAuthenticated.value) {
    return '인증된 세션이 확인되었습니다'
  }

  if (authQuery.isUnauthorized.value) {
    return '로그인이 필요합니다'
  }

  return '상태를 확인할 수 없습니다'
})
</script>
