import { Document, Scalar } from 'yaml'

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
