<template>
  <AppShell
    eyebrow="Problem List"
    title="Search your solution history"
    description="Filter by title, platform, or difficulty, then jump directly into the note you want to review."
  >
    <template v-if="authQuery.isPending.value || solutionsQuery.isLoading.value">
      <section class="placeholder-grid">
        <article class="placeholder-card">
          <span>Status</span>
          <strong>Loading solution history</strong>
        </article>
      </section>
    </template>

    <template v-else-if="authQuery.isUnauthorized.value">
      <section class="placeholder-card">
        <span>Status</span>
        <strong>Redirecting to sign-in</strong>
      </section>
    </template>

    <template v-else-if="solutionsQuery.data.value">
      <section class="toolbar-row">
        <label class="search-input">
          <span>Search</span>
          <input
            v-model="keyword"
            type="search"
            placeholder="Search title, platform, difficulty"
          >
        </label>

        <p class="results-caption">
          {{ filteredSolutions.length }} results
        </p>
      </section>

      <section class="solution-list">
        <RouterLink
          v-for="solution in filteredSolutions"
          :key="solution.id"
          :to="`/problems/${solution.id}`"
          class="solution-card"
        >
          <div class="solution-card-header">
            <div>
              <p class="shell-section-label">
                {{ solution.problem.platform }} · {{ solution.problem.difficulty }}
              </p>
              <h3>{{ solution.problem.title }}</h3>
            </div>
            <span :class="['status-pill', solution.solved ? 'status-pill-success' : 'status-pill-fail']">
              {{ solution.solved ? 'Solved' : 'Retry' }}
            </span>
          </div>

          <div class="solution-meta">
            <span>#{{ solution.problem.externalProblemId }}</span>
            <span>{{ solution.timeElapsed }} ms</span>
            <span>{{ formatDate(solution.updatedAt) }}</span>
          </div>

          <p class="solution-preview">
            {{ truncateMemo(solution.memoMarkdown) }}
          </p>
        </RouterLink>
      </section>
    </template>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { useAuthStatusQuery } from '../features/auth/useAuthStatusQuery'
import { filterSolutions } from '../features/solutions/filterSolutions'
import { useSolutionsQuery } from '../features/solutions/useSolutionsQuery'
import AppShell from '../layouts/AppShell.vue'

const router = useRouter()
const authQuery = useAuthStatusQuery()
const solutionsQuery = useSolutionsQuery(authQuery.isAuthenticated)
const keyword = ref('')

watch(authQuery.isUnauthorized, (isUnauthorized) => {
  if (isUnauthorized) {
    router.replace('/')
  }
})

const filteredSolutions = computed(() =>
  filterSolutions(solutionsQuery.data.value ?? [], keyword.value),
)

function truncateMemo(markdown: string) {
  return markdown.replace(/\s+/g, ' ').trim().slice(0, 140) || 'No memo yet.'
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('ko-KR')
}
</script>
