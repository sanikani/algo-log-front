# Korean UI Copy Design

## Overview

- Goal: translate all user-visible screen copy in the frontend from English to Korean.
- Scope: titles, descriptions, buttons, status text, card labels, placeholders, and empty-state text shown in the current UI.
- Out of scope: introducing an i18n framework, changing route names or internal identifiers, translating backend data values such as platform names or difficulty values, and refactoring unrelated code.

## Current Context

- The app is a Vue 3 + TypeScript + Vite frontend with a small number of page components.
- User-visible copy is currently hardcoded directly in page templates and in the shared shell layout.
- No localization framework is present, so the lowest-risk approach is direct replacement of English UI copy with Korean copy.
- Existing git conventions in `README.md` require feature branches named `feature/#issue-number-description` and pull requests targeting `develop`.

## Design Decisions

### Translation Strategy

- Keep the current structure and replace English user-facing strings inline with Korean strings.
- Favor natural, service-style Korean over literal translation.
- Keep technical or domain terms only where they read naturally in Korean. For example, use `마크다운 메모` instead of `Markdown notes`.
- Preserve data-backed values from the API. Platform names, difficulty names, problem IDs, and URLs remain unchanged unless they are static UI labels authored in the frontend.

### Target Components

- `src/layouts/AppShell.vue`
  - Sidebar navigation labels
  - Shared shell heading and logout label
- `src/pages/HomePage.vue`
  - Landing copy, auth status text, buttons, and status cards
- `src/pages/DashboardPage.vue`
  - Shell header, loading and redirect states, metric labels, panel labels, heatmap captions, and fallback text
- `src/pages/ProblemsPage.vue`
  - Shell header, loading and redirect states, search label and placeholder, result count, status pill text, and empty preview fallback
- `src/pages/ProblemDetailPage.vue`
  - Shell header, loading and redirect states, metric labels, action buttons, section labels, and detail captions
- `src/pages/ProblemEditorPage.vue`
  - Shell header, loading state, form section labels, field labels, placeholders, button labels, and submit-state text

## Copy Rules

- Use natural Korean labels such as `문제 목록`, `노트 작성`, `로그아웃`.
- Loading and transition states should read consistently, for example `세션 확인 중`, `로그인 화면으로 이동 중`, `저장 중`.
- Avoid partial English sentences in user-facing text unless the underlying data itself is English.
- Keep concise labels where space is limited, especially in buttons and metric cards.

## Git Workflow

### Issue and Branch

- Create or use a dedicated issue for the Korean UI copy task.
- Create a feature branch following repository convention: `feature/#<issue-number>-korean-ui-copy`.

### Commit Units

- Commit 1: shared shell and home page Korean copy
- Commit 2: dashboard and problems list Korean copy
- Commit 3: problem detail and editor Korean copy
- Commit 4: follow-up fixes if copy adjustments or tests require them

This commit slicing keeps review scope aligned with visible screens and makes later rollback or copy revision straightforward.

### Pull Request

- Open a PR targeting `develop`.
- State clearly that the change translates user-visible UI copy only.
- Mention explicitly that internal identifiers, route names, and API-backed values were not localized in this task.

## Verification

- Run the project verification command used in this repository, preferring `npm run check` when it covers lint and test expectations.
- If needed, also run `npm run build` to confirm templates still compile after copy changes.
- Search the page and layout components for leftover English UI copy before opening the PR.
- Manually confirm key screens still read naturally in Korean:
  - home
  - dashboard
  - problems list
  - problem detail
  - problem create/edit

## Risks and Mitigations

- Risk: inconsistent tone across pages if strings are translated ad hoc.
  - Mitigation: use the agreed service-style Korean tone and keep repeated state messages aligned across pages.
- Risk: accidentally translating API data values that should remain as-is.
  - Mitigation: change only static frontend-authored labels and messages.
- Risk: mixing this work with unrelated local modifications in a dirty worktree.
  - Mitigation: stage and commit only the spec file now, then isolate implementation commits by file scope later.
