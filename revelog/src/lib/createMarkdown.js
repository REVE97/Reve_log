import { Document, Scalar, parse } from 'yaml'
import { parsePost } from './markdown.js'

export const categoryOptions = {
  Engineering: ['TIL', 'Trouble Shooting', '기술 분석'],
  'Product Log': ['개발일지', '사용자 피드백', '회고'],
}

export function importMarkdown(source) {
  const normalized = source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  const frontmatter = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)/)
  if (!frontmatter) {
    throw new Error('파일 맨 위에 ---로 감싼 메타데이터가 필요합니다.')
  }

  const metadata = parse(frontmatter[1])
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    throw new Error('메타데이터는 title: 값과 같은 형식으로 작성해 주세요.')
  }
  for (const key of ['title', 'date', 'category']) {
    if (typeof metadata[key] !== 'string' || !metadata[key].trim()) {
      throw new Error(`${key} 항목에 올바른 문자열 값을 입력해 주세요.`)
    }
  }
  if (metadata.summary != null && typeof metadata.summary !== 'string') {
    throw new Error('summary는 문자열이어야 합니다.')
  }
  if (
    metadata.tags != null &&
    (!Array.isArray(metadata.tags) || metadata.tags.some(tag => typeof tag !== 'string'))
  ) {
    throw new Error('tags는 [Vue, JavaScript]와 같은 문자열 배열이어야 합니다.')
  }

  const category = metadata.category.trim()
  const collection = Object.keys(categoryOptions).find(key =>
    categoryOptions[key].includes(category),
  )
  if (!collection) {
    throw new Error(
      '분류는 TIL, Trouble Shooting, 기술 분석, 개발일지, 사용자 피드백, 회고 중 하나여야 합니다.',
    )
  }

  // 게시 페이지와 동일한 날짜 검증을 사용하되, 편집할 본문의 첫 제목은 제거하지 않습니다.
  parsePost(normalized)
  return {
    collection,
    form: {
      title: metadata.title.trim(),
      date: metadata.date,
      category,
      tags: (metadata.tags || []).join(', '),
      summary: metadata.summary || '',
      body: normalized.slice(frontmatter[0].length).trim(),
    },
  }
}

// YAML 직렬화로 따옴표, 콜론, 줄바꿈이 포함된 입력도 보존합니다.
export function createMarkdown(form) {
  const title = form.title.trim()
  const metadata = {
    title,
    date: form.date,
    category: form.category.trim(),
    tags: [
      ...new Set(
        form.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean),
      ),
    ],
    summary: form.summary.trim(),
  }

  const document = new Document(metadata)
  document.get('title', true).type = Scalar.QUOTE_DOUBLE
  document.get('summary', true).type = Scalar.QUOTE_DOUBLE
  document.get('tags').flow = true

  // 기존 작성 예시에서 복사한 안내용 이미지 블록만 제외합니다.
  const body = form.body
    .replace(
      /<!--\s*이미지 첨부 예시\s*-->\s*!\[요청 시작부터 성공 또는 실패까지의 화면 상태 흐름\]\(\.\/state-flow\.svg\)/g,
      '',
    )
    .trim()

  const frontmatter = document.toString({
    lineWidth: 0,
    doubleQuotedMinMultiLineLength: Infinity,
    flowCollectionPadding: false,
  })

  return `---\n${frontmatter}---\n\n${body}\n`
}
