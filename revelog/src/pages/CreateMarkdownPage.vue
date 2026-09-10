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
            <div class="markdown-section-heading">
              <h2 id="metadata-heading">
                <span>01</span>
                글 정보 (메타데이터)
              </h2>
              <span>* 필수 입력</span>
            </div>
            <div class="markdown-fields">
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
            <label class="markdown-field">
              <span class="markdown-body-label">내용 *</span>
              <textarea
                v-model="form.body"
                class="markdown-body-input"
                rows="20"
                required
                spellcheck="false"
                :placeholder="bodyPlaceholder"
                aria-describedby="body-help"
              ></textarea>
              <small id="body-help">본문은 ## 소제목부터 작성하세요.</small>
            </label>
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
import { computed, reactive, ref, watch } from 'vue'
import { categoryOptions, createMarkdown, importMarkdown } from '../lib/createMarkdown'
import { parsePost, renderPost } from '../lib/markdown'

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
