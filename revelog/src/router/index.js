import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import ProjectPage from '../pages/ProjectPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/project',
    name: 'project',
    component: ProjectPage,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router