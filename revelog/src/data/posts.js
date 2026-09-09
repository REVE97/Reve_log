import { parsePost, resolveImage } from '../lib/markdown'

export const collections = {
  engineering: {
    title: 'Engineering',
    label: 'ENGINEERING NOTES_',
    description: '배운 것을 정리하고, 문제를 해결한 과정을 기록합니다.',
    folder: 'Engineering',
    filters: ['전체', 'TIL', 'Trouble Shooting', '기술 분석'],
    filterLabel: '글 유형',
  },
  'product-log': {
    title: 'Product Log',
    label: 'BUILDING JOURNAL_',
    description: '만들고, 돌아보고, 더 나은 경험으로 이어가는 개발 기록.',
    folder: 'Product Log',
    filters: ['전체', '개발일지', '사용자 피드백', '회고'],
    filterLabel: '기록 유형',
  },
}

const documents = import.meta.glob(['./Engineering/*/*.md', './Product Log/*/*.md'], {
  query: '?raw',
  import: 'default',
  eager: true,
})
export const postAssets = import.meta.glob(
  [
    './Engineering/**/*.{svg,png,jpg,jpeg,webp,gif,avif}',
    './Product Log/**/*.{svg,png,jpg,jpeg,webp,gif,avif}',
  ],
  { query: '?url', import: 'default', eager: true },
)

const seen = new Set()
export const posts = Object.entries(documents)
  .map(([path, source]) => {
    const [, directory, slug] = path.split('/')
    const collection = Object.keys(collections).find(key => collections[key].folder === directory)
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
      throw new Error(`${path}: ${error.message}`)
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'ko'))
