<template>
  <AppShell
    :eyebrow="mode === 'edit' ? '문제 수정' : '노트 작성'"
    :title="mode === 'edit' ? '알고리즘 노트 수정하기' : '새 풀이 기록 남기기'"
    description="문제 정보를 한 번 기록해 두고, 풀이 코드와 메모를 이해가 쌓일 때마다 계속 다듬습니다."
  >
    <template v-if="isEditMode && solutionQuery.isLoading.value">
      <section class="placeholder-card">
        <span>상태</span>
        <strong>수정 화면 정보를 불러오는 중입니다</strong>
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
                  문제 정보
                </p>
                <h3>기본 정보</h3>
              </div>
            </div>

            <div class="form-grid">
              <label class="form-field">
                <span>플랫폼</span>
                <input
                  v-model="form.problem.platform"
                  :disabled="isEditMode"
                  placeholder="예: 백준"
                >
                <small v-if="getError('problem.platform')">{{ getError('problem.platform') }}</small>
              </label>

              <label class="form-field">
                <span>문제 ID</span>
                <input
                  v-model="form.problem.externalProblemId"
                  :disabled="isEditMode"
                  placeholder="예: 1000"
                >
                <small v-if="getError('problem.externalProblemId')">{{ getError('problem.externalProblemId') }}</small>
              </label>

              <label class="form-field form-field-wide">
                <span>제목</span>
                <input
                  v-model="form.problem.title"
                  :disabled="isEditMode"
                  placeholder="예: A+B"
                >
                <small v-if="getError('problem.title')">{{ getError('problem.title') }}</small>
              </label>

              <label class="form-field form-field-wide">
                <span>문제 URL</span>
                <input
                  v-model="form.problem.problemUrl"
                  :disabled="isEditMode"
                  placeholder="예: https://www.acmicpc.net/problem/1000"
                >
                <small v-if="getError('problem.problemUrl')">{{ getError('problem.problemUrl') }}</small>
              </label>

              <label class="form-field">
                <span>난이도</span>
                <input
                  v-model="form.problem.difficulty"
                  :disabled="isEditMode"
                  placeholder="예: 브론즈"
                >
                <small v-if="getError('problem.difficulty')">{{ getError('problem.difficulty') }}</small>
              </label>
            </div>
          </article>

          <article class="panel-card">
            <div class="panel-header">
              <div>
                <p class="shell-section-label">
                  풀이 내용
                </p>
                <h3>{{ isEditMode ? '노트 다듬기' : '첫 풀이 기록 작성' }}</h3>
              </div>
            </div>

            <div class="form-grid">
              <label class="form-field">
                <span>실행 시간(ms)</span>
                <input
                  v-model.number="form.timeElapsed"
                  type="number"
                  min="0"
                >
                <small v-if="getError('timeElapsed')">{{ getError('timeElapsed') }}</small>
              </label>

              <label class="form-field checkbox-field">
                <span>결과</span>
                <label class="checkbox-label">
                  <input
                    v-model="form.solved"
                    type="checkbox"
                  >
                  <span>{{ form.solved ? '해결 완료' : '다시 풀이 필요' }}</span>
                </label>
              </label>

              <label class="form-field form-field-wide">
                <span>코드</span>
                <textarea
                  v-model="form.code"
                  rows="14"
                  placeholder="풀이 코드를 붙여 넣어 주세요"
                />
                <small v-if="getError('code')">{{ getError('code') }}</small>
              </label>

              <label class="form-field form-field-wide">
                <span>메모 (Markdown)</span>
                <textarea
                  v-model="form.memoMarkdown"
                  rows="12"
                  placeholder="무엇을 배웠는지, 다시 볼 포인트가 무엇인지 적어 보세요"
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
            취소
          </RouterLink>
          <button
            class="primary-button button-reset"
            type="submit"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? '저장 중...' : isEditMode ? '노트 수정' : '노트 생성' }}
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
