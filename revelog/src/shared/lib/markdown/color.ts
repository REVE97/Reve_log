import type { MarkdownIt, Token } from 'markdown-it'

export const textColors = [
  { name: '차콜', value: '#242628' },
  { name: '블루 그레이', value: '#3e5066' },
  { name: '블루', value: '#356aa0' },
  { name: '그린', value: '#357454' },
  { name: '버건디', value: '#963f54' },
  { name: '브라운', value: '#94651b' },
]

// Only the editor's exact, palette-limited span syntax is supported. Raw HTML stays disabled.
export function markdownColorPlugin(md: MarkdownIt) {
  md.inline.ruler.before('html_inline', 'editor_color', (state, silent) => {
    if (!state.src.startsWith('<span style="color:', state.pos)) return false
    const match = state.src.slice(state.pos, state.posMax).match(/^<span style="color:(#[0-9a-f]{6})">([^\n]*?)<\/span>/i)
    if (!match || !textColors.some(color => color.value === match[1].toLowerCase())) return false
    if (state.level >= state.md.options.maxNesting) return false
    if (!silent) {
      const open = state.push('editor_color_open', 'span', 1)
      open.attrSet('style', `color:${match[1].toLowerCase()}`)
      const children: Token[] = []
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
