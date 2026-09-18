<template>
  <div class="resume-workspace markdown-workspace">
    <header class="document-toolbar markdown-toolbar">
      <div class="breadcrumb">
        <span>REVE</span>
        <span aria-hidden="true">/</span>
        Labs
        <span aria-hidden="true">/</span>
        Markdown 만들기
      </div>
      <div class="toolbar-actions">
        <button
          type="button"
          class="button button-secondary"
          :aria-pressed="preview"
          @click="preview = !preview"
        >
          {{ preview ? '작성으로 돌아가기' : '미리보기' }}
        </button>
        <button
          type="button"
          class="button button-secondary"
          :disabled="importing"
          @click="fileInput.click()"
        >
          {{ importing ? '불러오는 중…' : '불러오기' }}
        </button>
        <input
          ref="fileInput"
          type="file"
          accept=".md,.markdown"
          aria-label="Markdown 파일 불러오기"
          hidden
          @change="loadMarkdown"
        />
        <button
          type="button"
          class="button button-primary"
          @click="downloadMarkdown"
        >
          <span
            class="icon icon-download"
            aria-hidden="true"
          ></span>
          MD 다운로드
        </button>
      </div>
    </header>

    <div class="journal-content">
      <header class="markdown-heading">
        <p class="journal-eyebrow">LABS</p>
        <h1>Markdown 만들기</h1>
        <p class="journal-description">글 정보와 본문을 하나의 Markdown 파일로 정리합니다.</p>
      </header>

      <p
        v-if="error"
        class="markdown-feedback is-error"
        role="alert"
      >
        {{ error }}
      </p>
      <p
        v-if="notice"
        class="markdown-feedback"
        role="status"
      >
        {{ notice }}
      </p>

      <div class="markdown-layout">
        <form
          v-show="!preview"
          class="markdown-form"
          novalidate
          @submit.prevent="downloadMarkdown"
        >
          <section
            class="markdown-section"
            aria-labelledby="metadata-heading"
          >
            <button type="button" class="markdown-metadata-toggle" :aria-expanded="metadataOpen" aria-controls="markdown-metadata" @click="metadataOpen = !metadataOpen">
              <span id="metadata-heading"><b>01</b> 글 정보</span>
              <span class="markdown-metadata-summary"><strong>{{ form.title || '글 정보를 입력해 주세요' }}</strong><small>{{ collection }} · {{ form.category }} · {{ form.date }}</small></span>
              <span class="markdown-metadata-action">{{ metadataOpen ? '접기' : '수정' }} <span aria-hidden="true">{{ metadataOpen ? '⌃' : '⌄' }}</span></span>
            </button>
            <div v-show="metadataOpen" id="markdown-metadata" class="markdown-fields markdown-metadata-fields">
              <label class="markdown-field is-full">
                <span>제목 *</span>
                <input
                  v-model="form.title"
                  required
                  placeholder="제목을 입력해주세요"
                />
              </label>
              <label class="markdown-field">
                <span>기록 위치</span>
                <select v-model="collection">
                  <option value="Engineering">Engineering</option>
                  <option value="Product Log">Product Log</option>
                </select>
              </label>
              <label class="markdown-field">
                <span>작성일 *</span>
                <input
                  v-model="form.date"
                  type="date"
                  required
                />
              </label>
              <label class="markdown-field">
                <span>분류 *</span>
                <select
                  v-model="form.category"
                  required
                >
                  <option
                    v-for="category in categories"
                    :key="category"
                    :value="category"
                  >
                    {{ category }}
                  </option>
                </select>
              </label>
              <label class="markdown-field is-full">
                <span>
                  태그
                  <small>선택</small>
                </span>
                <input
                  v-model="form.tags"
                  placeholder="Vue, JavaScript, Vite"
                  aria-describedby="tags-help"
                />
                <small id="tags-help">쉼표로 구분합니다. 중복 태그는 한 번만 저장합니다.</small>
              </label>
              <label class="markdown-field is-full">
                <span>
                  요약
                  <small>선택</small>
                </span>
                <textarea
                  v-model="form.summary"
                  rows="3"
                  placeholder="목록에 표시할 글의 소개를 작성해 주세요."
                ></textarea>
              </label>
            </div>
          </section>

          <section
            class="markdown-section"
            aria-labelledby="body-heading"
          >
            <div class="markdown-section-heading">
              <h2 id="body-heading">
                <span>02</span>
                본문
              </h2>
              <span>MARKDOWN</span>
            </div>
            <label for="markdown-body-editor" class="markdown-body-label">내용 *</label>
            <div class="markdown-editor-shell">
              <div class="markdown-format-toolbar" role="group" aria-label="본문 서식" @pointerdown.prevent @keydown.esc="closeColorPalette">
                <button v-for="tool in formattingTools" :key="tool.action" type="button" :title="tool.title" :aria-label="tool.title" :class="['markdown-format-button', `format-${tool.action}`]" @click="applyFormat(tool.action)">{{ tool.label }}</button>
                <div ref="colorControl" class="markdown-color-control">
                  <button ref="colorButton" type="button" class="markdown-format-button markdown-color-button" aria-label="글자색" :aria-expanded="colorOpen" aria-controls="markdown-color-palette" @click="colorOpen = !colorOpen"><span :style="{ borderColor: currentColor }">A</span><small aria-hidden="true">⌄</small></button>
                  <div v-if="colorOpen" id="markdown-color-palette" class="markdown-color-palette" role="group" aria-label="글자색 선택">
                    <strong>글자색</strong>
                    <div class="markdown-color-swatches">
                      <button v-for="color in textColors" :key="color.value" type="button" :style="{ '--swatch-color': color.value }" :aria-label="color.name" :aria-pressed="currentColor === color.value" :title="color.name" @click="applyColor(color.value)"><span aria-hidden="true">{{ currentColor === color.value ? '✓' : '' }}</span></button>
                    </div>
                    <button type="button" class="markdown-color-reset" @click="applyColor(null)">기본색으로 되돌리기</button>
                  </div>
                </div>
                <button type="button" class="markdown-format-button" aria-label="인라인 코드" title="인라인 코드" @click="applyFormat('code')"><span class="icon icon-editor-code" aria-hidden="true"></span></button>
                <button type="button" class="markdown-format-button" aria-label="인용문" title="인용문" @click="applyFormat('quote')"><span class="icon icon-editor-quote" aria-hidden="true"></span></button>
                <button type="button" class="markdown-format-button" aria-label="글머리 목록" title="글머리 목록" @click="applyFormat('list')"><span class="icon icon-editor-list" aria-hidden="true"></span></button>
                <span id="body-help" class="markdown-format-help">{{ selection.end > selection.start ? '선택한 텍스트에 적용' : '텍스트를 선택하고 서식을 적용하세요.' }}</span>
              </div>
              <textarea
                id="markdown-body-editor"
                ref="bodyInput"
                :value="form.body"
                class="markdown-body-input"
                rows="20"
                required
                spellcheck="false"
                :placeholder="bodyPlaceholder"
                aria-describedby="body-help"
                @beforeinput="rememberBeforeInput"
                @input="onBodyInput"
                @select="rememberSelection"
                @keyup="rememberSelection"
                @click="rememberSelection"
                @blur="rememberSelection"
                @keydown="editorShortcut"
              ></textarea>
              <div class="markdown-editor-footer"><div class="markdown-history" role="group" aria-label="편집 기록" @pointerdown.prevent><button type="button" class="markdown-format-button" aria-label="실행 취소" title="실행 취소 (Ctrl/⌘ Z)" :disabled="!undoHistory.length" @click="undoEdit"><span class="icon icon-editor-undo" aria-hidden="true"></span></button>
                <button type="button" class="markdown-format-button" aria-label="다시 실행" title="다시 실행 (Ctrl/⌘ Shift Z)" :disabled="!redoHistory.length" @click="redoEdit"><span class="icon icon-editor-redo" aria-hidden="true"></span></button></div></div>
            </div>
            <p class="markdown-editor-message" role="status">{{ editorMessage }}</p>
          </section>
        </form>

        <section
          v-if="preview"
          class="markdown-preview"
          aria-label="작성 중인 글 미리보기"
        >
          <div class="markdown-section-heading">
            <h2>미리보기</h2>
            <span>게시 전 확인</span>
          </div>
          <p
            v-if="previewResult.error"
            class="markdown-feedback is-error"
            role="alert"
          >
            {{ previewResult.error }}
          </p>
          <template v-else>
            <header class="journal-post-header">
              <div class="journal-meta">
                <span class="journal-category">
                  {{ previewResult.post.category || '분류 없음' }}
                </span>
              </div>
              <h1>{{ previewResult.post.title || '제목 없는 글' }}</h1>
              <p class="journal-description">{{ previewResult.post.summary }}</p>
              <div class="journal-post-byline">
                <time :datetime="previewResult.post.date">{{ previewResult.post.date }}</time>
              </div>
              <div class="journal-tags">
                <span
                  v-for="tag in previewResult.post.tags"
                  :key="tag"
                >
                  #{{ tag }}
                </span>
              </div>
            </header>
            <details
              v-if="previewResult.toc.length"
              class="markdown-preview-toc"
              open
            >
              <summary>목차</summary>
              <nav aria-label="미리보기 목차">
                <a
                  v-for="heading in previewResult.toc"
                  :key="heading.id"
                  :href="`#${heading.id}`"
                >
                  {{ heading.text }}
                </a>
              </nav>
            </details>
            <article
              v-if="form.body.trim()"
              class="journal-prose"
              v-html="previewResult.html"
            ></article>
            <p
              v-else
              class="markdown-preview-empty"
            >
              본문을 작성하면 이곳에 표시됩니다.
            </p>
          </template>
        </section>

        <aside class="markdown-guide">
          <p class="journal-eyebrow">사용 방법</p>
          <div class="markdown-file-card">
            <span
              class="icon icon-product-log"
              aria-hidden="true"
            ></span>
            <div>
              <strong>index.md</strong>
              <small>글 정보 + Markdown 본문</small>
            </div>
          </div>
          <ol>
            <li>글 정보와 본문을 작성합니다.</li>
            <li>미리보기에서 내용을 확인합니다.</li>
            <li>MD 파일을 다운로드합니다.</li>
          </ol>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { categoryOptions, createMarkdown, importMarkdown } from '../lib/createMarkdown'
import { parsePost, renderPost } from '../lib/markdown'
import { formatSelection, textColors } from '../lib/markdownEditor'

const metadataOpen = ref(true)
const bodyInput = ref(null)
const colorControl = ref(null)
const colorButton = ref(null)
const colorOpen = ref(false)
const currentColor = ref('#3e5066')
const editorMessage = ref('')
const selection = reactive({ start: 0, end: 0 })
const undoHistory = ref([])
const redoHistory = ref([])
let beforeInput = null
const formattingTools = [
  { action: 'h2', label: '제목', title: '제목 적용 (H2)' },
  { action: 'h3', label: '부제목', title: '부제목 적용 (H3)' },
  { action: 'bold', label: 'B', title: '굵게 (Ctrl/⌘ B)' },
  { action: 'italic', label: 'I', title: '기울임 (Ctrl/⌘ I)' },
  { action: 'strike', label: 'S', title: '취소선' },
]
function rememberSelection() {
  if (!bodyInput.value) return
  selection.start = bodyInput.value.selectionStart
  selection.end = bodyInput.value.selectionEnd
}
function snapshot() {
  return { body: form.body, start: selection.start, end: selection.end }
}
function rememberBeforeInput() {
  rememberSelection()
  beforeInput = snapshot()
}
function pushUndo(value) {
  undoHistory.value.push(value)
  if (undoHistory.value.length > 100) undoHistory.value.shift()
  redoHistory.value = []
}
function onBodyInput(event) {
  if (event.target.value !== form.body) pushUndo(beforeInput || snapshot())
  form.body = event.target.value
  beforeInput = null
  rememberSelection()
  editorMessage.value = ''
}
async function restoreEdit(value) {
  form.body = value.body
  await nextTick()
  bodyInput.value?.focus({ preventScroll: true })
  bodyInput.value?.setSelectionRange(value.start, value.end)
  selection.start = value.start
  selection.end = value.end
}
function undoEdit() {
  if (!undoHistory.value.length) return
  rememberSelection()
  redoHistory.value.push(snapshot())
  restoreEdit(undoHistory.value.pop())
  editorMessage.value = '실행을 취소했습니다.'
}
function redoEdit() {
  if (!redoHistory.value.length) return
  rememberSelection()
  undoHistory.value.push(snapshot())
  restoreEdit(redoHistory.value.pop())
  editorMessage.value = '다시 적용했습니다.'
}
async function applyFormat(action, value) {
  rememberSelection()
  const result = formatSelection(form.body, selection.start, selection.end, action, value)
  if (!result) return
  if (result.body !== form.body) pushUndo(snapshot())
  colorOpen.value = false
  await restoreEdit(result)
  editorMessage.value = '서식을 적용했습니다. 미리보기에서 확인할 수 있습니다.'
}
function applyColor(value) {
  currentColor.value = value || '#242628'
  applyFormat('color', value)
}
function closeColorPalette(event) {
  const wasColorOpen = colorOpen.value
  colorOpen.value = false
  if (event?.key === 'Escape') {
    if (wasColorOpen) colorButton.value?.focus()
    else bodyInput.value?.focus({ preventScroll: true })
  }
}
function dismissColor(event) {
  if (!colorControl.value?.contains(event.target)) colorOpen.value = false
}
function editorShortcut(event) {
  if (event.key === 'Escape') {
    closeColorPalette(event)
    return
  }
  if (event.isComposing || !(event.ctrlKey || event.metaKey) || event.altKey) return
  const key = event.key.toLowerCase()
  if (['b', 'i', 'z', 'y'].includes(key)) {
    event.preventDefault()
    if (key === 'z') event.shiftKey ? redoEdit() : undoEdit()
    else if (key === 'y') redoEdit()
    else applyFormat(key === 'b' ? 'bold' : 'italic')
  }
}
onMounted(() => document.addEventListener('pointerdown', dismissColor))
onBeforeUnmount(() => document.removeEventListener('pointerdown', dismissColor))

const now = new Date()
const today = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0'),
].join('-')
const collection = ref('Engineering')
const form = reactive({
  title: '',
  date: today,
  category: 'TIL',
  tags: '',
  summary: '',
  body: '',
})
const preview = ref(false)
watch(preview, () => closeColorPalette())
const error = ref('')
const notice = ref('')
const fileInput = ref(null)
const importing = ref(false)
const bodyPlaceholder =
  '## Intro\n\n글을 시작하게 된 계기를 작성해 주세요.\n\n## 주요 내용\n\n- 구현 내용\n- 배운 점'
const categories = computed(() => categoryOptions[collection.value])
const markdown = computed(() => createMarkdown(form))
const previewResult = computed(() => {
  try {
    const post = parsePost(markdown.value)
    return {
      post,
      ...renderPost(post.body, './preview', {}),
      error: '',
    }
  } catch (cause) {
    return { error: cause.message }
  }
})

watch(
  collection,
  () => {
    form.category = categories.value[0]
  },
  { flush: 'sync' },
)
watch(
  form,
  () => {
    error.value = ''
    notice.value = ''
  },
  { flush: 'sync' },
)

async function loadMarkdown(event) {
  const file = event.target.files?.[0]
  if (!file) return
  error.value = ''
  notice.value = ''
  importing.value = true
  try {
    if (!/\.(md|markdown)$/i.test(file.name)) {
      throw new Error('.md 또는 .markdown 파일을 선택해 주세요.')
    }
    const imported = importMarkdown(await file.text())
    collection.value = imported.collection
    Object.assign(form, imported.form)
    preview.value = false
    selection.start = selection.end = 0
    undoHistory.value = []
    redoHistory.value = []
    metadataOpen.value = true
    closeColorPalette()
    notice.value = `${file.name} 파일을 불러왔습니다. cover는 제외하고 폼에 반영했습니다.`
  } catch (cause) {
    error.value = `파일을 불러오지 못했습니다. ${cause.message}`
  } finally {
    importing.value = false
    event.target.value = ''
  }
}

function downloadMarkdown() {
  error.value = ''
  notice.value = ''
  if (!form.title.trim() || !form.date || !form.category.trim() || !form.body.trim()) {
    metadataOpen.value = true
    preview.value = false
    error.value = '제목, 작성일, 분류, 본문을 모두 입력해 주세요.'
    return
  }
  if (previewResult.value.error) {
    error.value = previewResult.value.error
    return
  }
  const blob = new Blob([markdown.value], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'index.md'
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  notice.value = 'index.md 다운로드를 요청했습니다. 다운로드 폴더에서 파일을 확인해 주세요.'
}
</script>
