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
        GitHub OAuth session auth is wired for the existing Spring backend. Enter through GitHub
        and the dashboard becomes the single source of truth for session status.
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
          Try current session
        </RouterLink>
      </div>

      <div class="status-grid">
        <article class="status-card">
          <span>Auth probe</span>
          <strong>{{ authMessage }}</strong>
        </article>
        <article class="status-card">
          <span>Protected routes</span>
          <strong>/dashboard, /problems</strong>
        </article>
        <article class="status-card">
          <span>Runtime mode</span>
          <strong>Credential-based API client</strong>
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
    return 'Checking session...'
  }

  if (authQuery.isAuthenticated.value) {
    return 'Authenticated session detected'
  }

  if (authQuery.isUnauthorized.value) {
    return 'Sign in required'
  }

  return 'Probe unavailable'
})
</script>
