<template>
  <div class="shell-layout">
    <aside class="shell-sidebar">
      <div>
        <p class="shell-kicker">
          AlgoLog
        </p>
        <h1 class="shell-title">
          Developer notebook for algorithm drills.
        </h1>
      </div>

      <nav
        class="shell-nav"
        aria-label="Primary"
      >
        <RouterLink to="/dashboard">
          Dashboard
        </RouterLink>
        <RouterLink to="/problems">
          Problem List
        </RouterLink>
        <RouterLink to="/problems/new">
          Write Note
        </RouterLink>
      </nav>

      <a
        class="ghost-link"
        :href="logoutUrl"
      >
        Sign out
      </a>
    </aside>

    <div class="shell-main">
      <header class="shell-header">
        <div>
          <p class="shell-section-label">
            {{ eyebrow }}
          </p>
          <h2>{{ title }}</h2>
        </div>
        <p class="shell-caption">
          {{ description }}
        </p>
      </header>

      <main class="shell-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { getLogoutUrl } from '../features/auth/auth'

defineProps<{
  eyebrow: string
  title: string
  description: string
}>()

const logoutUrl = getLogoutUrl()
</script>
