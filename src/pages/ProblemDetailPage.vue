<!-- eslint-disable vue/no-v-html -->
<template>
  <AppShell
    eyebrow="Problem Detail"
    title="Inspect a single algorithm note"
    description="Review the original problem metadata, execution snapshot, code, and markdown memo in one place."
  >
    <template v-if="authQuery.isPending.value || solutionQuery.isLoading.value">
      <section class="placeholder-card">
        <span>Status</span>
        <strong>Loading note detail</strong>
      </section>
    </template>

    <template v-else-if="authQuery.isUnauthorized.value">
      <section class="placeholder-card">
        <span>Status</span>
        <strong>Redirecting to sign-in</strong>
      </section>
    </template>

    <template v-else-if="solution">
      <section class="stats-grid">
        <article class="metric-card">
          <span>Platform</span>
          <strong>{{ solution.problem.platform }}</strong>
          <p>#{{ solution.problem.externalProblemId }}</p>
        </article>
        <article class="metric-card">
          <span>Difficulty</span>
          <strong>{{ solution.problem.difficulty }}</strong>
          <p>{{ solution.solved ? 'Solved' : 'Retry needed' }}</p>
        </article>
        <article class="metric-card">
          <span>Elapsed</span>
          <strong>{{ solution.timeElapsed }} ms</strong>
          <p>Updated {{ formatDate(solution.updatedAt) }}</p>
        </article>
      </section>

      <section class="toolbar-row detail-toolbar">
        <a
          class="secondary-button"
          :href="solution.problem.problemUrl"
          target="_blank"
          rel="noreferrer"
        >
          Open Problem
        </a>
        <div class="detail-actions">
          <RouterLink
            class="secondary-button"
            :to="`/problems/${solution.id}/edit`"
          >
            Edit
          </RouterLink>
          <button
            class="danger-button"
            type="button"
            :disabled="deleteMutation.isPending.value"
            @click="handleDelete"
          >
            {{ deleteMutation.isPending.value ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </section>

      <section class="detail-grid">
        <article class="panel-card">
          <div class="panel-header">
            <div>
              <p class="shell-section-label">
                Code
              </p>
              <h3>{{ solution.problem.title }}</h3>
            </div>
          </div>

          <pre class="code-block"><code>{{ solution.code }}</code></pre>
        </article>

        <article class="panel-card">
          <div class="panel-header">
            <div>
              <p class="shell-section-label">
                Memo
              </p>
              <h3>Markdown notes</h3>
            </div>
          </div>

          <div
            class="markdown-body"
            v-html="renderedMemo"
          />
        </article>
      </section>
    </template>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { useAuthStatusQuery } from '../features/auth/useAuthStatusQuery'
import { renderMarkdown } from '../features/solutions/markdown'
import { useDeleteSolutionMutation } from '../features/solutions/useDeleteSolutionMutation'
import { useSolutionQuery } from '../features/solutions/useSolutionQuery'
import AppShell from '../layouts/AppShell.vue'

const route = useRoute()
const router = useRouter()
const authQuery = useAuthStatusQuery()
const solutionId = String(route.params.id)
const solutionQuery = useSolutionQuery(solutionId, authQuery.isAuthenticated)
const deleteMutation = useDeleteSolutionMutation()

watch(authQuery.isUnauthorized, (isUnauthorized) => {
  if (isUnauthorized) {
    router.replace('/')
  }
})

const solution = computed(() => solutionQuery.data.value)
const renderedMemo = computed(() => renderMarkdown(solution.value?.memoMarkdown ?? ''))

async function handleDelete() {
  if (!solution.value) {
    return
  }

  await deleteMutation.mutateAsync(solution.value.id)
  await router.push('/problems')
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('ko-KR')
}
</script>
