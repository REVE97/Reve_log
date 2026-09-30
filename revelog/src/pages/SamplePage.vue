<template>
  <div class="resume-workspace sample-workspace">
    <header class="document-toolbar">
      <div class="breadcrumb">
        <span>REVE</span>
        <span>/</span>
        Labs
        <span>/</span>
        UI 샘플
      </div>
    </header>

    <div class="sample-content">
      <header class="sample-heading">
        <div>
          <p class="section-label">LABS</p>
          <h1>UI 샘플</h1>
          <p>프론트엔드 개발 중 자주 사용하게 되는 UI 컴포넌트 샘플</p>
        </div>
      </header>

      <div class="playground">
        <section
          class="gallery"
          aria-label="컴포넌트 탐색"
        >
          <label class="sample-search">
            <span
              class="icon icon-search"
              aria-hidden="true"
            ></span>
            <input
              v-model="query"
              aria-label="컴포넌트 검색"
              placeholder="컴포넌트 검색..."
            />
          </label>

          <div
            class="categories"
            aria-label="컴포넌트 카테고리"
          >
            <button
              v-for="item in categories"
              :key="item"
              :aria-pressed="category === item"
              @click="category = item"
            >
              {{ item }}
            </button>
          </div>

          <div class="gallery-toolbar">
            <span aria-live="polite">{{ filteredSamples.length }}개의 컴포넌트</span>
          </div>

          <div
            v-if="filteredSamples.length"
            class="sample-grid"
          >
            <article
              v-for="sample in paginatedSamples"
              :key="sample.id"
              class="sample-card"
              :class="{ selected: selected.id === sample.id }"
            >
              <div class="card-demo">
                <div class="card-demo-toolbar">
                  <span>PREVIEW</span>
                  <button
                    type="button"
                    class="sample-reset"
                    :aria-label="`${sample.name} 초기화`"
                    title="샘플 초기화"
                    @click="resetSample(sample.id)"
                  >
                    <span
                      class="icon icon-rotate"
                      aria-hidden="true"
                    ></span>
                  </button>
                </div>
                <div class="card-demo-content">
                  <component
                    :is="sample.component"
                    :key="`${sample.id}-${sampleResetKeys[sample.id]}`"
                  />
                </div>
              </div>
              <button
                class="card-caption"
                :aria-pressed="selected.id === sample.id"
                @click="selectSample(sample)"
              >
                <span>
                  <strong>{{ sample.name }}</strong>
                  <small>{{ sample.tag }}</small>
                </span>
                <span
                  class="icon icon-editor-code code-symbol"
                  aria-hidden="true"
                ></span>
                <span class="sr-only">코드 보기</span>
              </button>
            </article>
          </div>
          <div
            v-else
            class="empty-state"
          >
            <strong>검색 결과가 없습니다</strong>
            <p>다른 검색어나 카테고리를 선택해 보세요.</p>
            <button
              class="button button-secondary"
              @click="query = ''; category = '전체'"
            >
              필터 초기화
            </button>
          </div>

          <nav
            v-if="filteredSamples.length >= pageSize"
            class="sample-pagination"
            aria-label="샘플 목록 페이지"
          >
            <button
              type="button"
              :disabled="currentPage === 1"
              aria-label="이전 페이지"
              @click="currentPage--"
            >
              이전
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              type="button"
              :aria-label="`${page}페이지`"
              :aria-current="currentPage === page ? 'page' : undefined"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <button
              type="button"
              :disabled="currentPage === totalPages"
              aria-label="다음 페이지"
              @click="currentPage++"
            >
              다음
            </button>
          </nav>
        </section>

        <section
          ref="inspector"
          class="inspector"
          aria-label="선택한 컴포넌트 코드"
          tabindex="-1"
        >
          <header class="inspector-heading">
            <h2>{{ selected.name }}</h2>
            <p>{{ selected.description }}</p>
          </header>

          <div class="code-heading">
            <h3>코드</h3>
            <button
              class="button button-secondary"
              @click="copyCode"
            >
              복사
            </button>
          </div>
          <div
            class="code-tabs"
            aria-label="코드 언어"
          >
            <button
              v-for="tab in codeTabs"
              :key="tab"
              :aria-pressed="codeTab === tab"
              @click="codeTab = tab; copyMessage = ''"
            >
              {{ tab }}
            </button>
            
          </div>
          <pre
            class="source-code"
            tabindex="0"
            :aria-label="`${selected.name} ${codeTab} 소스 코드`"
          ><code v-html="highlightedCode"></code></pre>
          <p
            class="copy-status"
            role="status"
          >
            {{ copyMessage }}
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'

hljs.registerLanguage('xml', xml)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('css', css)

const components = import.meta.glob('../data/samples/*.vue', {
  eager: true,
  import: 'default',
})
const sources = import.meta.glob('../data/samples/*.vue', {
  eager: true,
  query: '?raw',
  import: 'default',
})
const reactSources = import.meta.glob('../data/samples/*.jsx', {
  eager: true,
  query: '?raw',
  import: 'default',
})

// 추가 리스트
// 입력 순서 : 컴포넌트명, 제목, 필터링 카테고리, 종류명, 설명
const definitions = [
  ['HoverButton', 'Hover Button', '버튼', 'Button', 'Hover 기본 버튼'],
  ['SocialButton', 'Social Button', '버튼', 'Button', '소셜미디어 기본 버튼'],
  ['FormInput', 'Form Input', '인풋', 'Input', 'Form 기본 인풋'],
  ['MessageInput', 'Message Input', '인풋', 'Input', '메시지 및 파일첨부 기본 인풋'],
  ['DefaultLoading', 'Defalut Loading', '로딩', 'Loading', '기본 로딩 애니메이션 효과']
]

const samples = definitions.map(([id, name, category, tag, description]) => ({
  id,
  name,
  category,
  tag,
  description,
  component: components[`../data/samples/${id}.vue`],
  source: sources[`../data/samples/${id}.vue`],
  reactSource: reactSources[`../data/samples/${id}.jsx`],
}))

const categories = ['전체', '버튼', '인풋', '필터', '토글', '로딩']
const query = ref('')
const category = ref('전체')
const pageSize = 4
const currentPage = ref(1)
const selectedId = ref(samples[0].id)
const selected = computed(() =>
  samples.find(sample => sample.id === selectedId.value),
)
const codeTab = ref('CSS')
const sampleResetKeys = ref(
  Object.fromEntries(
    samples.map(sample => [sample.id, 0]),
  ),
)
const inspector = ref(null)
const copyMessage = ref('')

const filteredSamples = computed(() => {
  const search = query.value.trim().toLowerCase()

  return samples.filter(
    sample =>
      (category.value === '전체' || sample.category === category.value) &&
      `${sample.name} ${sample.category} ${sample.tag} ${sample.description}`
        .toLowerCase()
        .includes(search),
  )
})

const totalPages = computed(() =>
  Math.ceil(filteredSamples.value.length / pageSize),
)

const paginatedSamples = computed(() => {
  const start = (currentPage.value - 1) * pageSize

  return filteredSamples.value.slice(start, start + pageSize)
})

watch(
  [query, category],
  () => {
    currentPage.value = 1
  },
  { flush: 'sync' },
)

const codeTabs = computed(() =>
  selected.value.reactSource ? ['Vue', 'React', 'CSS'] : ['Vue', 'CSS'],
)

const visibleCode = computed(() => {
  if (codeTab.value === 'Vue') return selected.value.source
  if (codeTab.value === 'React') return selected.value.reactSource || ''

  return (
    selected.value.source.match(/<style scoped>([\s\S]*?)<\/style>/)?.[1].trim() || ''
  )
})

const codeLanguages = {
  Vue: 'xml',
  React: 'javascript',
  CSS: 'css',
}

const highlightedCode = computed(() =>
  hljs.highlight(visibleCode.value, {
    language: codeLanguages[codeTab.value],
  }).value,
)

function resetSample(id) {
  sampleResetKeys.value[id]++
}

async function selectSample(sample) {
  selectedId.value = sample.id

  if (!codeTabs.value.includes(codeTab.value)) codeTab.value = 'Vue'
  copyMessage.value = ''

  if (window.matchMedia('(max-width: 1100px)').matches) {
    await nextTick()
    inspector.value?.focus({ preventScroll: true })
    inspector.value?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    })
  }
}

async function copyCode() {
  const label = `${selected.value.name} ${codeTab.value}`

  try {
    await navigator.clipboard.writeText(visibleCode.value)
    copyMessage.value = `${label} 코드를 복사했습니다.`
  } catch {
    copyMessage.value = '복사하지 못했습니다. 코드 영역에서 직접 선택해 복사해 주세요.'
  }
}
</script>
