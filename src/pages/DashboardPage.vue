<template>
  <AppShell
    eyebrow="Dashboard"
    title="Study signals and weekly rhythm"
    description="Review your total attempts, success balance, platform spread, and the past year of activity without leaving one screen."
  >
    <template v-if="authQuery.isPending.value">
      <section class="placeholder-grid">
        <article class="placeholder-card">
          <span>Status</span>
          <strong>Checking session</strong>
        </article>
        <article class="placeholder-card">
          <span>Loading</span>
          <strong>Fetching dashboard metrics</strong>
        </article>
      </section>
    </template>

    <template v-else-if="authQuery.isUnauthorized.value">
      <section class="placeholder-card">
        <span>Status</span>
        <strong>Redirecting to sign-in</strong>
      </section>
    </template>

    <template v-else-if="summary">
      <section class="arrival-card">
        <div class="arrival-copy">
          <p class="shell-section-label">
            Session active
          </p>
          <h3>Signed in and ready to continue</h3>
          <p class="arrival-message">
            Signed in with your current GitHub session. Review your progress, then jump straight
            into the next note when you are ready.
          </p>
        </div>

        <div class="arrival-actions">
          <RouterLink
            class="primary-button"
            to="/problems/new"
          >
            Write a note
          </RouterLink>
          <RouterLink
            class="secondary-button"
            to="/problems"
          >
            Browse problem list
          </RouterLink>
        </div>
      </section>

      <section class="stats-grid">
        <article class="metric-card">
          <span>Total Notes</span>
          <strong>{{ summary.totalCount }}</strong>
          <p>All saved solution records in your account.</p>
        </article>
        <article class="metric-card">
          <span>Solved</span>
          <strong>{{ summary.solvedCount }}</strong>
          <p>Successful submissions turned into study notes.</p>
        </article>
        <article class="metric-card">
          <span>Failed</span>
          <strong>{{ summary.failedCount }}</strong>
          <p>Attempts worth revisiting before the next round.</p>
        </article>
      </section>

      <section class="dashboard-grid">
        <article class="panel-card heatmap-panel">
          <div class="panel-header">
            <div>
              <p class="shell-section-label">
                Heatmap
              </p>
              <h3>Past 12 months</h3>
            </div>
            <p class="panel-caption">
              {{ heatmapCaption }}
            </p>
          </div>

          <div
            v-if="heatmapQuery.isLoading.value"
            class="heatmap-fallback"
          >
            Loading heatmap...
          </div>
          <div
            v-else-if="heatmapQuery.isError.value"
            class="heatmap-fallback"
          >
            Heatmap is temporarily unavailable.
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
                :title="`${cell.label}: ${cell.count} solved`"
              />
            </div>
          </div>
        </article>

        <article class="panel-card">
          <div class="panel-header">
            <div>
              <p class="shell-section-label">
                Platform Mix
              </p>
              <h3>Where you practice</h3>
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
                Difficulty Mix
              </p>
              <h3>Challenge distribution</h3>
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
import { RouterLink, useRouter } from 'vue-router'

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
    return 'No solved activity recorded yet.'
  }

  return `${heatmapQuery.data.value.length} active day records loaded`
})
</script>

<style scoped>
.arrival-card {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(192, 193, 255, 0.16);
  border-radius: 20px;
  background: rgba(31, 32, 33, 0.92);
  box-shadow: var(--shadow-ambient);
}

.arrival-copy h3 {
  margin: 8px 0 0;
  font-size: 1.5rem;
}

.arrival-message {
  max-width: 58ch;
  margin: 12px 0 0;
  color: var(--color-text-muted);
}

.arrival-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

@media (max-width: 900px) {
  .arrival-card {
    align-items: start;
    flex-direction: column;
  }
}
</style>
