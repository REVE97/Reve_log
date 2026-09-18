export const textColors = [
  { name: '차콜', value: '#242628' },
  { name: '블루 그레이', value: '#3e5066' },
  { name: '블루', value: '#356aa0' },
  { name: '그린', value: '#357454' },
  { name: '버건디', value: '#963f54' },
  { name: '브라운', value: '#94651b' },
]

export function formatSelection(source, start, end, action, value) {
  start = Math.max(0, Math.min(start, source.length))
  end = Math.max(start, Math.min(end, source.length))
  const replace = (from, to, text, offset = 0, length = text.length) => ({
    body: source.slice(0, from) + text + source.slice(to),
    start: from + offset, end: from + offset + length,
  })
  if (['h2', 'h3', 'quote', 'list'].includes(action)) {
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
  const oddStars = text => (text.match(/^\*+/)?.[0].length || 0) % 2 === 1
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

// Only the editor's exact, palette-limited span syntax is supported. Raw HTML stays disabled.
export function markdownColorPlugin(md) {
  md.inline.ruler.before('html_inline', 'editor_color', (state, silent) => {
    if (!state.src.startsWith('<span style="color:', state.pos)) return false
    const match = state.src.slice(state.pos, state.posMax).match(/^<span style="color:(#[0-9a-f]{6})">([^\n]*?)<\/span>/i)
    if (!match || !textColors.some(color => color.value === match[1].toLowerCase())) return false
    if (state.level >= state.md.options.maxNesting) return false
    if (!silent) {
      const open = state.push('editor_color_open', 'span', 1)
      open.attrSet('style', `color:${match[1].toLowerCase()}`)
      const children = []
      state.md.inline.parse(match[2], state.md, state.env, children)
      for (const child of children) {
        child.level += state.level
        state.tokens.push(child)
      }
      state.push('editor_color_close', 'span', -1)
    }
    state.pos += match[0].length
    return true
  })
}
