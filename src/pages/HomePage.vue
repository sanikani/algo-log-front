<template>
  <main class="landing-page">
    <section class="landing-panel">
      <p class="eyebrow">
        AlgoLog Workspace
      </p>
      <h1>
        Turn solved problems into a learning trail you can actually revisit.
      </h1>
      <p class="lead">
        Sign in with GitHub to review past notes, capture a fresh solution, and keep your practice
        history in one place.
      </p>

      <div class="landing-actions">
        <a
          class="primary-button"
          :href="githubLoginUrl"
        >
          Continue with GitHub
        </a>
        <RouterLink
          class="secondary-button"
          to="/dashboard"
        >
          Preview the dashboard
        </RouterLink>
      </div>

      <div class="status-grid">
        <article class="status-card">
          <span>Session status</span>
          <strong>{{ authMessage }}</strong>
        </article>
        <article class="status-card">
          <span>After sign-in</span>
          <strong>Land on your dashboard and start the next note.</strong>
        </article>
        <article class="status-card">
          <span>Inside the workspace</span>
          <strong>Dashboard, problem history, and note writing stay one click away.</strong>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { getGithubLoginUrl } from '../features/auth/auth'
import { useAuthStatusQuery } from '../features/auth/useAuthStatusQuery'

const router = useRouter()
const githubLoginUrl = getGithubLoginUrl()
const authQuery = useAuthStatusQuery()

watch(
  authQuery.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      router.replace('/dashboard')
    }
  },
  { immediate: true },
)

const authMessage = computed(() => {
  if (authQuery.isPending.value) {
    return 'Checking session...'
  }

  if (authQuery.isAuthenticated.value) {
    return 'Signed in — sending you to the dashboard'
  }

  if (authQuery.isUnauthorized.value) {
    return 'Sign in required'
  }

  return 'Probe unavailable'
})
</script>
