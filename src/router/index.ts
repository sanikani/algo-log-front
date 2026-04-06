import { createRouter, createWebHistory } from 'vue-router'

import DashboardPage from '../pages/DashboardPage.vue'
import HomePage from '../pages/HomePage.vue'
import ProblemDetailPage from '../pages/ProblemDetailPage.vue'
import ProblemEditorPage from '../pages/ProblemEditorPage.vue'
import ProblemsPage from '../pages/ProblemsPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/problems',
      name: 'problems',
      component: ProblemsPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/problems/new',
      name: 'problem-create',
      component: ProblemEditorPage,
      meta: {
        requiresAuth: true,
        mode: 'create',
      },
    },
    {
      path: '/problems/:id',
      name: 'problem-detail',
      component: ProblemDetailPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/problems/:id/edit',
      name: 'problem-edit',
      component: ProblemEditorPage,
      meta: {
        requiresAuth: true,
        mode: 'edit',
      },
    },
  ],
})

export default router
