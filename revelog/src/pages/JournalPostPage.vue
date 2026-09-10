<template>
  <div class="resume-workspace journal-workspace">
    <header class="document-toolbar">
      <div class="breadcrumb">
        <span>REVE</span>
        <span aria-hidden="true">/</span>
        <RouterLink :to="`/${collection}`">{{ config.title }}</RouterLink>
      </div>
      <RouterLink
        class="journal-back-link"
        :to="`/${collection}`"
      >
        ← 목록으로
      </RouterLink>
    </header>
    <div
      v-if="post"
      class="journal-content journal-post-content"
    >
      <header class="journal-post-header">
        <div class="journal-meta">
          <span class="journal-category">{{ post.category }}</span>
          <span v-if="post.project">{{ post.project }}</span>
        </div>
        <h1>{{ post.title }}</h1>
        <p class="journal-description">{{ post.summary }}</p>
        <div class="journal-post-byline">
          <time
            v-if="post.date"
            :datetime="post.date"
          >
            {{ post.date.replaceAll('-', '.') }}
          </time>
        </div>
        <div class="journal-tags">
          <span
            v-for="tag in post.tags"
            :key="tag"
          >
            #{{ tag }}
          </span>
        </div>
      </header>
      <div class="journal-reading-layout">
        <article
          class="journal-prose"
          aria-label="글 본문"
          v-html="rendered.html"
        ></article>
        <aside
          v-if="rendered.toc.length"
          class="journal-toc"
        >
          <details open>
            <summary>
              ON THIS PAGE
              <span>목차</span>
            </summary>
            <nav aria-label="글 목차">
              <a
                v-for="heading in rendered.toc"
                :key="heading.id"
                :href="`#${heading.id}`"
                :class="{ 'is-subheading': heading.level === 3 }"
              >
                {{ heading.text }}
              </a>
            </nav>
          </details>
        </aside>
      </div>
      <footer class="document-footer">
        <RouterLink :to="`/${collection}`">← {{ config.title }} 목록</RouterLink>
        <span>REVE / NOTES</span>
      </footer>
    </div>
    <div
      v-else
      class="journal-empty"
    >
      <p class="journal-eyebrow">404 / NOTE NOT FOUND</p>
      <h1>기록을 찾을 수 없습니다.</h1>
      <p>주소가 바뀌었거나 등록되지 않은 글입니다.</p>
      <RouterLink
        class="button button-primary"
        :to="`/${collection}`"
      >
        {{ config.title }}로 돌아가기
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { collections, posts, postAssets } from '../data/posts'
import { renderPost } from '../lib/markdown'

const route = useRoute()
const collection = computed(() => route.meta.collection)
const config = computed(() => collections[collection.value])
const post = computed(() =>
  posts.find(entry => entry.collection === collection.value && entry.slug === route.params.slug),
)
const rendered = computed(() =>
  post.value ? renderPost(post.value.body, post.value.folder, postAssets) : { html: '', toc: [] },
)

watch(
  post,
  value => {
    document.title = `${value?.title || '기록을 찾을 수 없습니다'} · REVE`
  },
  { immediate: true },
)
</script>
