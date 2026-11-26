import type { parsePost } from '@/shared/lib/markdown'

export type CollectionId = 'engineering' | 'product-log'
export interface Post extends ReturnType<typeof parsePost> {
  collection: CollectionId
  slug: string
  folder: string
  url: string
  coverUrl: string
}
