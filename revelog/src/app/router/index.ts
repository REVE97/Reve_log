import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { HomePage } from '@/pages/home'
import { SideProjectPage } from '@/pages/side-project'
import { CreateMarkdownPage } from '@/pages/create-markdown'
import { ImagesToPdfPage } from '@/pages/images-to-pdf'
import { SamplePage } from '@/pages/sample'

const routes: RouteRecordRaw[] = [
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
  {
    path: '/labs/sample',
    name: 'sample',
    component: SamplePage,
    meta: { title: 'UI 샘플 · REVE' },
  },
  ...(['engineering', 'product-log'] as const).flatMap(collection => [
    {
      path: `/${collection}`,
      name: collection,
      component: () => import('@/pages/journal').then(module => module.JournalPage),
      meta: { collection },
    },
    {
      path: `/${collection}/:slug`,
      name: `${collection}-post`,
      component: () => import('@/pages/journal').then(module => module.JournalPostPage),
      meta: { collection },
    },
  ]),
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
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
