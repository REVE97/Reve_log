<template>
  <div class="resume-workspace journal-workspace">
    <header class="document-toolbar">
      <div class="breadcrumb">
        <span>REVE</span>
        <span aria-hidden="true">/</span>
        {{ config.title }}
      </div>
      <span class="journal-toolbar-note">NOTES & PROGRESS</span>
    </header>
    <div class="journal-content">
      <header class="journal-heading">
        <p class="journal-eyebrow">{{ config.label }}</p>
        <div class="journal-title-row">
          <h1>{{ config.title }}</h1>
        </div>
        <p class="journal-description">{{ config.description }}</p>
      </header>

      <div class="journal-controls">
        <label class="journal-search">
          <span
            class="icon icon-search"
            aria-hidden="true"
          ></span>
          <input
            v-model="query"
            type="search"
            aria-label="기록 검색"
            placeholder="제목, 내용, 태그로 검색"
          />
        </label>
        <label
          v-if="collection === 'product-log' && projects.length"
          class="journal-project-select"
        >
          <span>프로젝트</span>
          <select
            v-model="project"
            aria-label="프로젝트 필터"
          >
            <option value="전체">전체 프로젝트</option>
            <option
              v-for="name in projects"
              :key="name"
            >
              {{ name }}
            </option>
          </select>
        </label>
      </div>
      <div class="journal-filter-row">
        <div
          class="journal-filters"
          role="group"
          :aria-label="config.filterLabel"
        >
          <button
            v-for="filter in filters"
            :key="filter"
            type="button"
            :aria-pressed="category === filter"
            @click="category = filter"
          >
            {{ filter }}
          </button>
        </div>
        <p
          class="journal-result-count"
          role="status"
        >
          {{ filtered.length }}개의 기록
          <span aria-hidden="true">·</span>
          최신순
        </p>
      </div>

      <div
        v-if="filtered.length"
        class="journal-list"
        :class="{ 'journal-timeline': collection === 'product-log' }"
      >
        <article
          v-for="post in filtered"
          :key="post.url"
          class="journal-entry"
        >
          <div
            v-if="collection === 'product-log'"
            class="journal-date-column"
          >
            <time :datetime="post.date || undefined">
              {{ post.date ? post.date.replaceAll('-', '.') : '날짜 미지정' }}
            </time>
            <span>{{ post.project || '개발 기록' }}</span>
          </div>
          <RouterLink
            :to="post.url"
            class="journal-card"
          >
            <div class="journal-card-content">
              <div class="journal-meta">
                <span class="journal-category">{{ post.category }}</span>
                <time
                  v-if="collection === 'engineering' && post.date"
                  :datetime="post.date"
                >
                  {{ post.date.replaceAll('-', '.') }}
                </time>
              </div>
              <h2>{{ post.title }}</h2>
              <p class="journal-summary">{{ post.summary }}</p>
              <div class="journal-card-bottom">
                <div class="journal-tags">
                  <span
                    v-for="tag in post.tags"
                    :key="tag"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </div>
            <img
              v-if="post.coverUrl"
              class="journal-card-cover"
              :src="post.coverUrl"
              alt=""
              loading="lazy"
            />
          </RouterLink>
        </article>
      </div>
      <div
        v-else
        class="journal-empty"
      >
        <h2>
          {{ entries.length ? '조건에 맞는 기록이 없습니다.' : '아직 등록된 기록이 없습니다.' }}
        </h2>
        <p>다른 검색어나 분류로 찾아보세요.</p>
      </div>
      <footer class="document-footer">
        <span>REVE / {{ config.title.toUpperCase() }}</span>
        <span>배움과 경험의 기록</span>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { collections, posts } from '../data/posts'

const route = useRoute()
const collection = computed(() => route.meta.collection)
const config = computed(() => collections[collection.value])
const query = ref('')
const category = ref('전체')
const project = ref('전체')
const entries = computed(() => posts.filter(post => post.collection === collection.value))
const filters = computed(() => [
  ...new Set([...config.value.filters, ...entries.value.map(post => post.category)]),
])
const projects = computed(() => [
  ...new Set(entries.value.map(post => post.project).filter(Boolean)),
])
const filtered = computed(() => {
  const term = query.value.trim().toLocaleLowerCase()
  return entries.value.filter(
    post =>
      (category.value === '전체' || post.category === category.value) &&
      (project.value === '전체' || post.project === project.value) &&
      (!term ||
        [post.title, post.summary, post.body, ...post.tags]
          .join(' ')
          .toLocaleLowerCase()
          .includes(term)),
  )
})

function resetFilters() {
  query.value = ''
  category.value = '전체'
  project.value = '전체'
}

watch(collection, resetFilters)
watch(
  config,
  value => {
    document.title = `${value.title} · REVE`
  },
  { immediate: true },
)
</script>
