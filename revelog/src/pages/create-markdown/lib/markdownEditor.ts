import { textColors } from '@/shared/lib/markdown'

export type FormatAction = 'h2' | 'h3' | 'quote' | 'list' | 'color' | 'bold' | 'italic' | 'strike' | 'code'
export interface EditSnapshot { body: string; start: number; end: number }

export function formatSelection(source: string, start: number, end: number, action: FormatAction, value?: string | null): EditSnapshot | null {
  start = Math.max(0, Math.min(start, source.length))
  end = Math.max(start, Math.min(end, source.length))
  const replace = (from: number, to: number, text: string, offset = 0, length = text.length) => ({
    body: source.slice(0, from) + text + source.slice(to),
    start: from + offset, end: from + offset + length,
  })
  if (action === 'h2' || action === 'h3' || action === 'quote' || action === 'list') {
    const from = start === 0 ? 0 : source.lastIndexOf('\n', start - 1) + 1
    const last = end > start && source[end - 1] === '\n' ? end - 1 : end
    const next = source.indexOf('\n', last)
    const to = next < 0 ? source.length : next
    const prefix = { h2: '## ', h3: '### ', quote: '> ', list: '- ' }[action]
    const lines = source.slice(from, to).split('\n')
    const remove = lines.every(line => line.startsWith(prefix))
    const text = lines.map(line => {
      if (remove) return line.slice(prefix.length)
      if (action === 'h2' || action === 'h3') line = line.replace(/^#{1,6}\s+/, '')
      return prefix + line
    }).join('\n')
    return replace(from, to, text)
  }
  if (action === 'color') {
    if (value && !textColors.some(color => color.value === value)) return null
    let from = start
    let to = end
    let text = source.slice(start, end)
    const before = source.slice(0, start).match(/<span style="color:#[0-9a-f]{6}">$/i)
    if (before && source.slice(end, end + 7) === '</span>') {
      from -= before[0].length
      to += 7
    }
    text = text.replace(/<span style="color:#[0-9a-f]{6}">([^\n]*?)<\/span>/gi, '$1')
    if (!text && !value) return null
    text ||= '텍스트'
    if (!value) return replace(from, to, text)
    const open = `<span style="color:${value}">`
    const formatted = text.split('\n').map(line => line ? `${open}${line}</span>` : '').join('\n')
    return replace(from, to, formatted, text.includes('\n') ? 0 : open.length, text.includes('\n') ? formatted.length : text.length)
  }
  const marker = { bold: '**', italic: '*', strike: '~~', code: '`' }[action]
  if (!marker) return null
  const selected = source.slice(start, end)
  const oddStars = (text: string) => (text.match(/^\*+/)?.[0].length || 0) % 2 === 1
  const selectedItalic = action !== 'italic' || (oddStars(selected) && oddStars([...selected].reverse().join('')))
  if (selectedItalic && selected.startsWith(marker) && selected.endsWith(marker) && selected.length > marker.length * 2) {
    return replace(start, end, selected.slice(marker.length, -marker.length))
  }
  const surroundingItalic = action !== 'italic' || (
    (source.slice(0, start).match(/\*+$/)?.[0].length || 0) % 2 === 1 && oddStars(source.slice(end))
  )
  if (surroundingItalic && source.slice(start - marker.length, start) === marker && source.slice(end, end + marker.length) === marker) {
    return replace(start - marker.length, end + marker.length, selected)
  }
  const text = selected || '텍스트'
  return replace(start, end, `${marker}${text}${marker}`, marker.length, text.length)
}

