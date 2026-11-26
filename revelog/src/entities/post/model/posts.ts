import { parsePost, resolveImage } from '@/shared/lib/markdown'
import { collections } from './collections'
import type { CollectionId, Post } from './types'

const documents = import.meta.glob<string>(['../content/Engineering/*/*.md', '../content/Product Log/*/*.md'], {
  query: '?raw',
  import: 'default',
  eager: true,
})
export const postAssets = import.meta.glob<string>(
  [
    '../content/Engineering/**/*.{svg,png,jpg,jpeg,webp,gif,avif}',
    '../content/Product Log/**/*.{svg,png,jpg,jpeg,webp,gif,avif}',
  ],
  { query: '?url', import: 'default', eager: true },
)

const seen = new Set()
export const posts: Post[] = Object.entries(documents)
  .map(([path, source]) => {
    const relativePath = path.slice('../content/'.length)
    const [directory, slug] = relativePath.split('/')
    const collection = (Object.keys(collections) as CollectionId[]).find(key => collections[key].folder === directory)
    if (!collection) throw new Error(`알 수 없는 기록 위치: ${directory}`)
    const key = `${collection}/${slug}`
    if (seen.has(key))
      throw new Error(`${directory}/${slug}: 글 폴더에는 Markdown 파일을 하나만 넣어주세요.`)
    seen.add(key)
    try {
      const post = parsePost(source, slug)
      const folder = path.slice(0, path.lastIndexOf('/'))
      return {
        ...post,
        collection,
        slug,
        folder,
        url: `/${collection}/${encodeURIComponent(slug)}`,
        coverUrl: resolveImage(post.cover, folder, postAssets),
      }
    } catch (error) {
      throw new Error(`${path}: ${error instanceof Error ? error.message : String(error)}`)
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'ko'))
