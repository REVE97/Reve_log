import MarkdownIt from 'markdown-it'
import { parse } from 'yaml'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'

for (const [name, language] of Object.entries({ javascript, typescript, xml, css, json, bash })) {
  hljs.registerLanguage(name, language)
}

const md = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true,
  highlight(code, language) {
    return language && hljs.getLanguage(language)
      ? hljs.highlight(code, { language, ignoreIllegals: true }).value
      : ''
  },
})

// Raw HTML stays escaped. Images may use local files or HTTPS URLs.
const defaultValidateLink = md.validateLink.bind(md)
md.validateLink = url => defaultValidateLink(url) && !/^data:/i.test(url)

export function parsePost(source, fallbackTitle = '제목 없는 글') {
  const normalized = source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  const frontmatter = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)/)
  const metadata = frontmatter ? (parse(frontmatter[1]) ?? {}) : {}
  if (typeof metadata !== 'object' || Array.isArray(metadata)) {
    throw new Error('글 상단 메타데이터는 key: value 형식이어야 합니다.')
  }
  let body = frontmatter ? normalized.slice(frontmatter[0].length).trim() : normalized.trim()
  const firstHeading = body.match(/^#\s+(.+)(?:\n|$)/)
  const title = String(metadata.title || firstHeading?.[1] || fallbackTitle)
  if (firstHeading) body = body.slice(firstHeading[0].length).trim()
  const date = String(metadata.date || '')
  if (
    date &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(Date.parse(date)) ||
      new Date(date).toISOString().slice(0, 10) !== date)
  ) {
    throw new Error(`작성일은 YYYY-MM-DD 형식의 유효한 날짜여야 합니다: ${date}`)
  }
  return {
    title,
    body,
    date,
    category: String(metadata.category || '기록'),
    project: String(metadata.project || ''),
    summary: String(metadata.summary || ''),
    cover: String(metadata.cover || ''),
    tags: Array.isArray(metadata.tags) ? metadata.tags.map(String) : [],
  }
}

export function resolveImage(path, folder, assets) {
  if (/^https:\/\//i.test(path)) return path
  if (!path || /^(?:[a-z][a-z\d+.-]*:|\/)/i.test(path)) return ''
  let decoded
  try {
    decoded = decodeURIComponent(path.split(/[?#]/)[0])
  } catch {
    return ''
  }
  const parts = folder.split('/')
  const baseLength = parts.length
  for (const part of decoded.split('/')) {
    if (part === '.' || !part) continue
    if (part === '..') {
      if (parts.length <= baseLength) return ''
      parts.pop()
    } else parts.push(part)
  }
  return assets[parts.join('/')] || ''
}

const renderImage = md.renderer.rules.image
md.renderer.rules.image = (tokens, index, options, env, self) => {
  const token = tokens[index]
  const path = token.attrGet('src')
  const resolved = resolveImage(path, env.folder, env.assets)
  if (!resolved) {
    return `<span class="journal-image-missing">이미지를 찾을 수 없습니다: ${md.utils.escapeHtml(path)}</span>`
  }
  token.attrSet('src', resolved)
  token.attrSet('loading', 'lazy')
  token.attrSet('decoding', 'async')
  return renderImage(tokens, index, options, env, self)
}

const renderLink =
  md.renderer.rules.link_open ||
  ((tokens, index, options, env, self) => self.renderToken(tokens, index, options))
md.renderer.rules.link_open = (tokens, index, options, env, self) => {
  if (/^https?:\/\//i.test(tokens[index].attrGet('href') || '')) {
    tokens[index].attrSet('target', '_blank')
    tokens[index].attrSet('rel', 'noopener noreferrer')
  }
  return renderLink(tokens, index, options, env, self)
}

export function renderPost(body, folder, assets) {
  const env = { folder, assets }
  const tokens = md.parse(body, env)
  const toc = []
  let headingIndex = 0
  const levels = tokens
    .filter(token => token.type === 'heading_open')
    .map(token => Number(token.tag.slice(1)))
  const shift = levels.includes(1) ? 1 : 0
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]
    if (token.type === 'heading_open' || token.type === 'heading_close') {
      const level = Math.min(6, Number(token.tag.slice(1)) + shift)
      token.tag = `h${level}`
      if (token.type === 'heading_open') {
        const id = `section-${++headingIndex}`
        token.attrSet('id', id)
        const inline = tokens[index + 1]
        const text =
          inline.children
            ?.filter(child => ['text', 'code_inline'].includes(child.type))
            .map(child => child.content)
            .join('') || inline.content
        if (level <= 3) toc.push({ id, text, level })
      }
    }
  }
  return { html: md.renderer.render(tokens, md.options, env), toc }
}
