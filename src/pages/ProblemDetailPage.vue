<!-- eslint-disable vue/no-v-html -->
<template>
  <AppShell
    eyebrow="문제 상세"
    title="하나의 알고리즘 노트를 살펴봅니다"
    description="문제 정보, 실행 결과, 코드, 마크다운 메모를 한 화면에서 확인할 수 있습니다."
  >
    <template v-if="authQuery.isPending.value || solutionQuery.isLoading.value">
      <section class="placeholder-card">
        <span>상태</span>
        <strong>문제 상세를 불러오는 중입니다</strong>
      </section>
    </template>

    <template v-else-if="authQuery.isUnauthorized.value">
      <section class="placeholder-card">
        <span>상태</span>
        <strong>로그인 화면으로 이동하는 중입니다</strong>
      </section>
    </template>

    <template v-else-if="solution">
      <section class="stats-grid">
        <article class="metric-card">
          <span>플랫폼</span>
          <strong>{{ solution.problem.platform }}</strong>
          <p>#{{ solution.problem.externalProblemId }}</p>
        </article>
        <article class="metric-card">
          <span>난이도</span>
          <strong>{{ solution.problem.difficulty }}</strong>
          <p>{{ solution.solved ? '풀이 완료' : '다시 검토 필요' }}</p>
        </article>
        <article class="metric-card">
          <span>소요 시간</span>
          <strong>{{ solution.timeElapsed }} ms</strong>
          <p>{{ formatDate(solution.updatedAt) }}에 업데이트됨</p>
        </article>
      </section>

      <section class="toolbar-row detail-toolbar">
        <a
          class="secondary-button"
          :href="solution.problem.problemUrl"
          target="_blank"
          rel="noreferrer"
        >
          문제 보기
        </a>
        <div class="detail-actions">
          <RouterLink
            class="secondary-button"
            :to="`/problems/${solution.id}/edit`"
          >
            수정
          </RouterLink>
          <button
            class="danger-button"
            type="button"
            :disabled="deleteMutation.isPending.value"
            @click="handleDelete"
          >
            {{ deleteMutation.isPending.value ? '삭제하는 중...' : '삭제' }}
          </button>
        </div>
      </section>

      <section class="detail-grid">
        <article class="panel-card">
          <div class="panel-header">
            <div>
              <p class="shell-section-label">
                코드
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
                메모
              </p>
              <h3>마크다운 메모</h3>
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
