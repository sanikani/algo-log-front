<template>
  <AppShell
    eyebrow="대시보드"
    title="학습 신호와 주간 리듬"
    description="총 시도 수, 성공과 실패의 균형, 플랫폼 분포, 지난 1년 활동을 한 화면에서 확인하세요."
  >
    <template v-if="authQuery.isPending.value">
      <section class="placeholder-grid">
        <article class="placeholder-card">
          <span>상태</span>
          <strong>세션 상태 확인 중</strong>
        </article>
        <article class="placeholder-card">
          <span>불러오기</span>
          <strong>대시보드 지표를 불러오는 중</strong>
        </article>
      </section>
    </template>

    <template v-else-if="authQuery.isUnauthorized.value">
      <section class="placeholder-card">
        <span>상태</span>
        <strong>로그인 화면으로 이동 중</strong>
      </section>
    </template>

    <template v-else-if="summary">
      <section class="stats-grid">
        <article class="metric-card">
          <span>총 풀이 기록</span>
          <strong>{{ summary.totalCount }}</strong>
          <p>계정에 저장된 모든 풀이 기록입니다.</p>
        </article>
        <article class="metric-card">
          <span>해결</span>
          <strong>{{ summary.solvedCount }}</strong>
          <p>성공한 제출을 풀이 기록으로 정리한 수입니다.</p>
        </article>
        <article class="metric-card">
          <span>실패</span>
          <strong>{{ summary.failedCount }}</strong>
          <p>다음 도전 전에 다시 살펴볼 풀이 기록입니다.</p>
        </article>
      </section>

      <section class="dashboard-grid">
        <article class="panel-card heatmap-panel">
          <div class="panel-header">
            <div>
              <p class="shell-section-label">
                열 지도
              </p>
              <h3>지난 12개월</h3>
            </div>
            <p class="panel-caption">
              {{ heatmapCaption }}
            </p>
          </div>

          <div
            v-if="heatmapQuery.isLoading.value"
            class="heatmap-fallback"
          >
            열 지도를 불러오는 중...
          </div>
          <div
            v-else-if="heatmapQuery.isError.value"
            class="heatmap-fallback"
          >
            열 지도를 일시적으로 사용할 수 없습니다.
          </div>
          <div
            v-else
            class="heatmap-grid"
          >
            <div
              v-for="column in heatmapColumns"
              :key="column[0]?.key"
              class="heatmap-column"
            >
              <span
                v-for="cell in column"
                :key="cell.key"
                :class="['heatmap-cell', `heatmap-level-${cell.level}`]"
                :title="`${cell.label}: ${cell.count}회 해결`"
              />
            </div>
          </div>
        </article>

        <article class="panel-card">
          <div class="panel-header">
            <div>
              <p class="shell-section-label">
                플랫폼 분포
              </p>
              <h3>어디에서 연습했는지</h3>
            </div>
          </div>

          <ul class="distribution-list">
            <li
              v-for="entry in summary.platformCounts"
              :key="entry.name"
            >
              <span>{{ entry.name }}</span>
              <strong>{{ entry.count }}</strong>
            </li>
          </ul>
        </article>

        <article class="panel-card">
          <div class="panel-header">
            <div>
              <p class="shell-section-label">
                난이도 분포
              </p>
              <h3>도전 난이도 분포</h3>
            </div>
          </div>

          <ul class="distribution-list">
            <li
              v-for="entry in summary.difficultyCounts"
              :key="entry.name"
            >
              <span>{{ entry.name }}</span>
              <strong>{{ entry.count }}</strong>
            </li>
          </ul>
        </article>
      </section>
    </template>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStatusQuery } from '../features/auth/useAuthStatusQuery'
import { buildHeatmapColumns } from '../features/dashboard/heatmap'
import { useDashboardHeatmapQuery } from '../features/dashboard/useDashboardHeatmapQuery'
import AppShell from '../layouts/AppShell.vue'

const router = useRouter()
const authQuery = useAuthStatusQuery()
const heatmapQuery = useDashboardHeatmapQuery(authQuery.isAuthenticated)

watch(authQuery.isUnauthorized, (isUnauthorized) => {
  if (isUnauthorized) {
    router.replace('/')
  }
})

const summary = computed(() => authQuery.data.value)
const heatmapColumns = computed(() => buildHeatmapColumns(heatmapQuery.data.value ?? []))
const heatmapCaption = computed(() => {
  if (!heatmapQuery.data.value?.length) {
    return '아직 기록된 해결 활동이 없습니다.'
  }

  return `${heatmapQuery.data.value.length}개의 활성 일자 기록을 불러왔습니다.`
})
</script>
