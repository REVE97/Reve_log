<script setup>
import { ref } from 'vue'
import SideProjectCaseStudy from '../components/SideProjectCaseStudy.vue'
import { sideProjects } from '../data/sideProjects'

const preview = ref(false)
const printProjects = () => window.print()
</script>

<template>
  <div
    class="resume-workspace sideproject-workspace"
    :class="{ 'is-preview': preview }"
  >
    <header class="document-toolbar">
      <div class="breadcrumb">
        <span>REVE</span>
        <span aria-hidden="true">/</span>
        Side Project
      </div>
      <div class="toolbar-actions">
        <button
          class="button button-secondary"
          :aria-pressed="preview"
          @click="preview = !preview"
        >
          {{ preview ? '웹 화면으로' : '미리보기' }}
        </button>
        <button
          class="button button-primary"
          @click="printProjects"
        >
          <span
            class="icon icon-download"
            aria-hidden="true"
          ></span>
          PDF 내보내기
        </button>
      </div>
    </header>
    <div
      v-if="preview"
      class="preview-notice"
      role="status"
    >
      <strong>A4 · 세로</strong>
      <span>문서 너비 미리보기입니다. 실제 페이지 나눔은 인쇄 화면에서 확인하세요.</span>
    </div>
    <p class="export-help">PDF 내보내기 → 인쇄 대상 ‘PDF로 저장’ · 머리글과 바닥글 해제 권장</p>

    <div class="resume-document sideproject-document">
      <SideProjectCaseStudy
        v-for="(project, index) in sideProjects"
        :key="project.id"
        :project="project"
        :index="index"
      />

      <footer class="document-footer">
        <span>REVE / SIDE PROJECT</span>
        <span>곽효재 · 포트폴리오</span>
      </footer>
    </div>
  </div>
</template>
