<template>
  <AppShell
    :eyebrow="mode === 'edit' ? 'Edit Problem' : 'Write Note'"
    :title="mode === 'edit' ? 'Update your algorithm note' : 'Capture a fresh solution record'"
    description="Capture the problem metadata once, then keep updating the code and memo as your understanding evolves."
  >
    <template v-if="isEditMode && solutionQuery.isLoading.value">
      <section class="placeholder-card">
        <span>Status</span>
        <strong>Loading editor state</strong>
      </section>
    </template>

    <template v-else>
      <form
        class="editor-form"
        @submit.prevent="handleSubmit"
      >
        <section class="editor-grid">
          <article class="panel-card">
            <div class="panel-header">
              <div>
                <p class="shell-section-label">
                  Problem Meta
                </p>
                <h3>Reference data</h3>
              </div>
            </div>

            <div class="form-grid">
              <label class="form-field">
                <span>Platform</span>
                <input
                  v-model="form.problem.platform"
                  :disabled="isEditMode"
                  placeholder="BAEKJOON"
                >
                <small v-if="getError('problem.platform')">{{ getError('problem.platform') }}</small>
              </label>

              <label class="form-field">
                <span>Problem ID</span>
                <input
                  v-model="form.problem.externalProblemId"
                  :disabled="isEditMode"
                  placeholder="1000"
                >
                <small v-if="getError('problem.externalProblemId')">{{ getError('problem.externalProblemId') }}</small>
              </label>

              <label class="form-field form-field-wide">
                <span>Title</span>
                <input
                  v-model="form.problem.title"
                  :disabled="isEditMode"
                  placeholder="A+B"
                >
                <small v-if="getError('problem.title')">{{ getError('problem.title') }}</small>
              </label>

              <label class="form-field form-field-wide">
                <span>Problem URL</span>
                <input
                  v-model="form.problem.problemUrl"
                  :disabled="isEditMode"
                  placeholder="https://www.acmicpc.net/problem/1000"
                >
                <small v-if="getError('problem.problemUrl')">{{ getError('problem.problemUrl') }}</small>
              </label>

              <label class="form-field">
                <span>Difficulty</span>
                <input
                  v-model="form.problem.difficulty"
                  :disabled="isEditMode"
                  placeholder="Bronze"
                >
                <small v-if="getError('problem.difficulty')">{{ getError('problem.difficulty') }}</small>
              </label>
            </div>
          </article>

          <article class="panel-card">
            <div class="panel-header">
              <div>
                <p class="shell-section-label">
                  Solution
                </p>
                <h3>{{ isEditMode ? 'Refine the note' : 'Write the first version' }}</h3>
              </div>
            </div>

            <div class="form-grid">
              <label class="form-field">
                <span>Execution Time (ms)</span>
                <input
                  v-model.number="form.timeElapsed"
                  type="number"
                  min="0"
                >
                <small v-if="getError('timeElapsed')">{{ getError('timeElapsed') }}</small>
              </label>

              <label class="form-field checkbox-field">
                <span>Result</span>
                <label class="checkbox-label">
                  <input
                    v-model="form.solved"
                    type="checkbox"
                  >
                  <span>{{ form.solved ? 'Solved' : 'Retry needed' }}</span>
                </label>
              </label>

              <label class="form-field form-field-wide">
                <span>Code</span>
                <textarea
                  v-model="form.code"
                  rows="14"
                  placeholder="Paste your solution code"
                />
                <small v-if="getError('code')">{{ getError('code') }}</small>
              </label>

              <label class="form-field form-field-wide">
                <span>Memo (Markdown)</span>
                <textarea
                  v-model="form.memoMarkdown"
                  rows="12"
                  placeholder="What did you learn? What would you revisit?"
                />
                <small v-if="getError('memoMarkdown')">{{ getError('memoMarkdown') }}</small>
              </label>
            </div>
          </article>
        </section>

        <div class="editor-actions">
          <RouterLink
            class="secondary-button"
            to="/problems"
          >
            Cancel
          </RouterLink>
          <button
            class="primary-button button-reset"
            type="submit"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Saving...' : isEditMode ? 'Update note' : 'Create note' }}
          </button>
        </div>
      </form>
    </template>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { ApiError } from '../types/api'
import { useAuthStatusQuery } from '../features/auth/useAuthStatusQuery'
import { getFieldError } from '../features/solutions/formErrors'
import { useCreateSolutionMutation, useUpdateSolutionMutation } from '../features/solutions/useSaveSolutionMutation'
import { useSolutionQuery } from '../features/solutions/useSolutionQuery'
import AppShell from '../layouts/AppShell.vue'

const route = useRoute()
const router = useRouter()
const authQuery = useAuthStatusQuery()
const solutionId = String(route.params.id ?? '')
const isEditMode = computed(() => route.meta.mode === 'edit')
const mode = computed(() => (isEditMode.value ? 'edit' : 'create'))
const solutionQuery = useSolutionQuery(solutionId, computed(() => authQuery.isAuthenticated.value && isEditMode.value))
const createMutation = useCreateSolutionMutation()
const updateMutation = useUpdateSolutionMutation(solutionId)

const form = reactive({
  code: '',
  timeElapsed: 0,
  solved: true,
  memoMarkdown: '',
  problem: {
    platform: '',
    externalProblemId: '',
    title: '',
    problemUrl: '',
    difficulty: '',
  },
})

watch(authQuery.isUnauthorized, (isUnauthorized) => {
  if (isUnauthorized) {
    router.replace('/')
  }
})

watch(
  () => solutionQuery.data.value,
  (solution) => {
    if (!solution) {
      return
    }

    form.code = solution.code
    form.timeElapsed = solution.timeElapsed
    form.solved = solution.solved
    form.memoMarkdown = solution.memoMarkdown
    form.problem.platform = solution.problem.platform
    form.problem.externalProblemId = solution.problem.externalProblemId
    form.problem.title = solution.problem.title
    form.problem.problemUrl = solution.problem.problemUrl
    form.problem.difficulty = solution.problem.difficulty
  },
  { immediate: true },
)

const currentError = computed(() => {
  const error = isEditMode.value ? updateMutation.error.value : createMutation.error.value
  return error instanceof ApiError ? error : null
})

const isSubmitting = computed(() =>
  isEditMode.value ? updateMutation.isPending.value : createMutation.isPending.value,
)

function getError(fieldName: string) {
  return getFieldError(currentError.value?.details, fieldName)
}

async function handleSubmit() {
  if (isEditMode.value) {
    const updated = await updateMutation.mutateAsync({
      code: form.code,
      timeElapsed: form.timeElapsed,
      solved: form.solved,
      memoMarkdown: form.memoMarkdown,
    })

    await router.push(`/problems/${updated.id}`)
    return
  }

  const created = await createMutation.mutateAsync({
    code: form.code,
    timeElapsed: form.timeElapsed,
    solved: form.solved,
    memoMarkdown: form.memoMarkdown,
    problem: { ...form.problem },
  })

  await router.push(`/problems/${created.id}`)
}
</script>
