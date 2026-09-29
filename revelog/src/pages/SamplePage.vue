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
              <span v-if="item === '전체'">{{ samples.length }}</span>
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
                    :key="`${sample.id}-${sampleStates[sample.id].resetKey}`"
                    :state="sampleStates[sample.id].state"
                  />
                </div>
                <div
                  class="state-control"
                  role="group"
                  :aria-label="`${sample.name} 미리보기 상태`"
                >
                  <button
                    v-for="state in sample.states"
                    :key="state"
                    type="button"
                    :aria-pressed="sampleStates[sample.id].state === state"
                    @click="sampleStates[sample.id].state = state"
                  >
                    {{ state }}
                  </button>
                </div>
              </div>
              <button
                class="card-caption"
                :aria-pressed="selected.id === sample.id"
                @click="selectSample(sample)"
              >
                <span>
                  <strong>{{ sample.name }}</strong>
                  <small>{{ sample.tag }} · Vue</small>
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
            <span
              class="sample-pagination-status"
              aria-live="polite"
              aria-atomic="true"
            >
              {{ currentPage }} / {{ totalPages }} 페이지
            </span>
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
              v-for="tab in ['Vue', 'CSS']"
              :key="tab"
              :aria-pressed="codeTab === tab"
              @click="codeTab = tab"
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

// One source of truth: the displayed code is the component running in the preview.
const components = import.meta.glob('../data/samples/*.vue', { eager: true, import: 'default' })
const sources = import.meta.glob('../data/samples/*.vue', { eager: true, query: '?raw', import: 'default' })
const definitions = [
  ['PrimaryButton', 'Primary Button', '버튼', 'Button', '기본 액션을 위한 버튼'],
  ['SearchInput', 'Search Input', '검색창', 'Input', '입력한 검색어로 목록을 필터링합니다'],
  ['FilterChips', 'Filter Chips', '필터', 'Filter', '카테고리를 선택해 결과를 좁혀 보세요'],
  ['ToggleSwitch', 'Toggle Switch', '토글', 'Toggle', '알림과 자동 저장 설정을 켜고 끕니다'],
  ['SegmentedControl', 'Segmented Control', '필터', 'Navigation', '목록과 그리드 보기 전환'],
  ['LoadingButton', 'Loading Button', '로딩', 'Feedback', '저장 중 상태와 완료 피드백을 확인하세요'],
]
const samples = definitions.map(([id, name, category, tag, description]) => ({
  id, name, category, tag, description,
  component: components[`../data/samples/${id}.vue`],
  source: sources[`../data/samples/${id}.vue`],
  states: id === 'PrimaryButton' ? ['Default', 'Hover', 'Disabled'] : ['Default', 'Disabled'],
}))
const categories = ['전체', '버튼', '검색창', '필터', '토글', '로딩']
const query = ref('')
const category = ref('전체')
const pageSize = 6
const currentPage = ref(1)
const selectedId = ref(samples[0].id)
const selected = computed(() => samples.find(sample => sample.id === selectedId.value))
const codeTab = ref('CSS')
const sampleStates = ref(Object.fromEntries(
  samples.map(sample => [sample.id, { state: 'Default', resetKey: 0 }]),
))
const inspector = ref(null)
const copyMessage = ref('')
const filteredSamples = computed(() => {
  const search = query.value.trim().toLowerCase()
  return samples.filter(sample =>
    (category.value === '전체' || sample.category === category.value) &&
    `${sample.name} ${sample.category} ${sample.tag} ${sample.description}`.toLowerCase().includes(search),
  )
})
const totalPages = computed(() => Math.ceil(filteredSamples.value.length / pageSize))
const paginatedSamples = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredSamples.value.slice(start, start + pageSize)
})

watch([query, category], () => {
  currentPage.value = 1
}, { flush: 'sync' })

const visibleCode = computed(() => codeTab.value === 'Vue' ? selected.value.source : selected.value.source.match(/<style scoped>([\s\S]*?)<\/style>/)?.[1].trim() || '')
const highlightedCode = computed(() => hljs.highlight(visibleCode.value, { language: codeTab.value === 'Vue' ? 'xml' : 'css' }).value)

function resetSample(id) {
  sampleStates.value[id].state = 'Default'
  sampleStates.value[id].resetKey++
}
async function selectSample(sample) {
  selectedId.value = sample.id
  copyMessage.value = ''
  if (window.matchMedia('(max-width: 1100px)').matches) {
    await nextTick()
    inspector.value?.focus({ preventScroll: true })
    inspector.value?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
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
