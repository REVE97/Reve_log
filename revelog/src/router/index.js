import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import SideProjectPage from '../pages/SideProjectPage.vue'
import CreateMarkdownPage from '../pages/CreateMarkdownPage.vue'
import ImagesToPdfPage from '../pages/ImagesToPdfPage.vue'

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
  {
    path: '/labs/createmarkdown',
    name: 'create-markdown',
    component: CreateMarkdownPage,
    meta: { title: 'Markdown 만들기 · REVE' },
  },
  {
    path: '/labs/imagestopdf',
    name: 'images-to-pdf',
    component: ImagesToPdfPage,
    meta: { title: '이미지 PDF 만들기 · REVE' },
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
    document.title =
      to.meta.title || (to.name === 'sideproject' ? 'Side Project · REVE' : 'reve.log')
})

export default router
