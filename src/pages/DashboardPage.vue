<template>
  <AppShell
    eyebrow="Dashboard"
    title="Study signals and weekly rhythm"
    description="This route is protected and will be filled with summary cards and heatmap in the next feature branch."
  >
    <section class="placeholder-grid">
      <article class="placeholder-card">
        <span>Status</span>
        <strong>{{ statusMessage }}</strong>
      </article>
      <article class="placeholder-card">
        <span>Next step</span>
        <strong>Dashboard summary and heatmap integration</strong>
      </article>
    </section>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStatusQuery } from '../features/auth/useAuthStatusQuery'
import AppShell from '../layouts/AppShell.vue'

const router = useRouter()
const authQuery = useAuthStatusQuery()

watch(authQuery.isUnauthorized, (isUnauthorized) => {
  if (isUnauthorized) {
    router.replace('/')
  }
})

const statusMessage = computed(() => {
  if (authQuery.isPending.value) {
    return 'Checking session'
  }

  if (authQuery.isAuthenticated.value) {
    return 'Authenticated'
  }

  if (authQuery.isUnauthorized.value) {
    return 'Redirecting to sign-in'
  }

  return 'Unable to validate session'
})
</script>
