<template>
  <aside class="sidebar">
    <RouterLink
      to="/"
      class="sidebar-brand"
      aria-label="REVE 홈"
    >
      <img
        :src="logo"
        alt=""
        class="sidebar-logo"
      />
      <span>REVE</span>
    </RouterLink>
    <nav
      class="sidebar-nav"
      aria-label="주 메뉴"
    >
      <RouterLink
        to="/"
        class="nav-item"
      >
        <span
          class="icon icon-resume"
          aria-hidden="true"
        ></span>
        Resume
      </RouterLink>
      <RouterLink
        to="/sideproject"
        class="nav-item"
      >
        <span
          class="icon icon-sideproject"
          aria-hidden="true"
        ></span>
        Side Project
      </RouterLink>
      <RouterLink
        to="/engineering"
        class="nav-item"
        :class="{ 'router-link-active': $route.meta.collection === 'engineering' }"
      >
        <span
          class="icon icon-engineering"
          aria-hidden="true"
        ></span>
        Engineering
      </RouterLink>
      <RouterLink
        to="/product-log"
        class="nav-item"
        :class="{ 'router-link-active': $route.meta.collection === 'product-log' }"
      >
        <span
          class="icon icon-product-log"
          aria-hidden="true"
        ></span>
        Product Log
      </RouterLink>
      <div class="labs-nav-group">
        <button
          type="button"
          class="nav-item labs-nav-toggle"
          :class="{ 'router-link-active': isLabs }"
          :aria-expanded="labsOpen"
          aria-controls="labs-subnav"
          @click="labsOpen = !labsOpen"
        >
          <span
            class="icon icon-labs"
            aria-hidden="true"
          ></span>
          Labs
          <span
            class="labs-chevron"
            :class="{ 'is-open': labsOpen }"
            aria-hidden="true"
          ></span>
        </button>
        <div
          v-show="labsOpen"
          id="labs-subnav"
          class="labs-subnav"
        >
          <RouterLink to="/labs/createmarkdown">Markdown 만들기</RouterLink>
        </div>
      </div>
    </nav>
    <nav
      v-if="$route.path === '/'"
      class="section-nav"
      aria-label="경력기술서 목차"
    >
      <RouterLink :to="{ path: '/', hash: '#profile' }">
        <span>01</span>
        Profile
      </RouterLink>
      <RouterLink :to="{ path: '/', hash: '#skills' }">
        <span>02</span>
        Skills
      </RouterLink>
      <RouterLink :to="{ path: '/', hash: '#experience' }">
        <span>03</span>
        Experience
      </RouterLink>
      <RouterLink :to="{ path: '/', hash: '#education' }">
        <span>04</span>
        Education
      </RouterLink>
      <RouterLink :to="{ path: '/', hash: '#certifications' }">
        <span>05</span>
        Certifications
      </RouterLink>
    </nav>
    <nav
      v-if="$route.path === '/sideproject'"
      class="section-nav"
      aria-label="사이드 프로젝트 목차"
    >
      <RouterLink
        v-for="(project, index) in sideProjects"
        :key="project.id"
        :to="{ path: '/sideproject', hash: `#${project.id}` }"
      >
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
        {{ project.name }}
      </RouterLink>
    </nav>
    <p class="sidebar-caption">Update / 2026.09.10</p>
  </aside>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import logo from '../assets/reve_logo.svg'
import { sideProjects } from '../data/sideProjects'

const route = useRoute()
const isLabs = computed(() => route.path.startsWith('/labs/'))
const labsOpen = ref(isLabs.value)
watch(
  () => route.path,
  () => {
    if (isLabs.value) labsOpen.value = true
  },
)
</script>
