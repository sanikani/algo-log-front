<template>
  <div class="shell-layout">
    <aside class="shell-sidebar">
      <div>
        <p class="shell-kicker">
          AlgoLog
        </p>
        <h1 class="shell-title">
          알고리즘 연습을 위한 개발자 노트북.
        </h1>
      </div>

      <nav
        class="shell-nav"
        aria-label="Primary"
      >
        <RouterLink to="/dashboard">
          대시보드
        </RouterLink>
        <RouterLink to="/problems">
          문제 목록
        </RouterLink>
        <RouterLink to="/problems/new">
          노트 작성
        </RouterLink>
      </nav>

      <a
        class="ghost-link"
        :href="logoutUrl"
      >
        로그아웃
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
