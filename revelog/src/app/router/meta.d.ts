import 'vue-router'
import type { CollectionId } from '@/entities/post'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    collection?: CollectionId
  }
}
