import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import SideProjectPage from '../pages/SideProjectPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/sideproject',
    name: 'sideproject',
    component: SideProjectPage,
  },
  ...['engineering', 'product-log'].flatMap(collection => [
    {
      path: `/${collection}`,
      name: collection,
      component: () => import('../pages/JournalPage.vue'),
      meta: { collection },
    },
    {
      path: `/${collection}/:slug`,
      name: `${collection}-post`,
      component: () => import('../pages/JournalPostPage.vue'),
      meta: { collection },
    },
  ]),
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash }
    return { top: 0 }
  },
})

router.afterEach(to => {
  if (!to.meta.collection)
    document.title = to.name === 'sideproject' ? 'Side Project · REVE' : 'reve.log'
})

export default router
