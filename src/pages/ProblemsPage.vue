<template>
  <AppShell
    eyebrow="문제 목록"
    title="내 풀이 기록을 검색하세요"
    description="제목, 플랫폼, 난이도로 걸러보고 바로 다시 볼 노트로 이동하세요."
  >
    <template v-if="authQuery.isPending.value || solutionsQuery.isLoading.value">
      <section class="placeholder-grid">
        <article class="placeholder-card">
          <span>상태</span>
          <strong>풀이 기록을 불러오는 중</strong>
        </article>
      </section>
    </template>

    <template v-else-if="authQuery.isUnauthorized.value">
      <section class="placeholder-card">
        <span>상태</span>
        <strong>로그인 화면으로 이동 중</strong>
      </section>
    </template>

    <template v-else-if="solutionsQuery.data.value">
      <section class="toolbar-row">
        <label class="search-input">
          <span>검색</span>
          <input
            v-model="keyword"
            type="search"
            placeholder="제목, 플랫폼, 난이도로 검색"
          >
        </label>

        <p class="results-caption">
          {{ filteredSolutions.length }}개 결과
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
              {{ solution.solved ? '해결' : '재시도' }}
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
  return markdown.replace(/\s+/g, ' ').trim().slice(0, 140) || '메모가 아직 없습니다.'
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('ko-KR')
}
</script>
