<template>
  <div
    class="resume-workspace"
    :class="{ 'is-preview': preview }"
  >
    <header class="document-toolbar">
      <div class="breadcrumb">
        <span>REVE</span>
        <span aria-hidden="true">/</span>
        Resume
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
          @click="printResume"
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

    <article
      class="resume-document"
      aria-label="곽효재 경력기술서"
    >
      <section
        id="profile"
        class="profile-section"
        aria-labelledby="profile-heading"
      >
        <p class="section-label">PROFILE_</p>
        <div class="profile-layout">
          <div>
            <h1 id="profile-heading">{{ profile.name }}</h1>
            <p class="profile-position">{{ profile.position }}</p>
            <p class="profile-birthday">{{ profile.birthday }}</p>
          </div>
          <address class="profile-contact">
            <a :href="`mailto:${profile.email}`">
              <span
                class="icon icon-email"
                aria-hidden="true"
              ></span>
              {{ profile.email }}
            </a>
            <a
              :href="profile.github"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="../assets/github_clear.svg"
                alt=""
              />
              github.com/REVE97
              <span
                class="icon external-arrow"
                aria-hidden="true"
              ></span>
            </a>
          </address>
        </div>
      </section>

      <section
        id="skills"
        class="skills-section"
        aria-labelledby="skills-heading"
      >
        <div class="section-heading">
          <h2
            id="skills-heading"
            class="section-label"
          >
            SKILLS_
          </h2>
        </div>
        <div
          class="profile-skills"
          aria-label="기술 스택"
        >
          <span
            v-for="skill in profile.skills"
            :key="skill"
            class="skill-tag"
          >
            {{ skill }}
          </span>
        </div>
      </section>

      <section
        id="experience"
        class="experience-section"
        aria-labelledby="experience-heading"
      >
        <div class="section-heading">
          <h2
            id="experience-heading"
            class="section-label"
          >
            EXPERIENCE_
          </h2>
          <span
            class="section-count"
            aria-label="회사 수"
          >
            {{ String(experience.length).padStart(2, '0') }}
          </span>
        </div>
        <section
          v-for="company in experience"
          :key="company.id"
          class="company-section"
          :aria-labelledby="company.id"
        >
          <header class="company-header">
            <h3 :id="company.id">
              <a
                :href="company.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ company.name }}
                <span
                  class="icon external-arrow"
                  aria-hidden="true"
                ></span>
              </a>
            </h3>
            <p>{{ company.team }}</p>
            <p class="company-period">{{ company.period }}</p>
          </header>
          <div class="project-list">
            <section
              v-for="project in company.projects"
              :key="project.id"
              class="project-entry"
              :aria-labelledby="project.id"
            >
              <p class="project-period">{{ project.period }}</p>
              <div class="project-content">
                <h4 :id="project.id">
                  <a
                    v-if="project.url"
                    :href="project.url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ project.title }}
                    <span
                      class="icon external-arrow"
                      aria-hidden="true"
                    ></span>
                  </a>
                  <template v-else>{{ project.title }}</template>
                </h4>
                <p class="project-summary">{{ project.summary }}</p>
                <ul class="project-details">
                  <li
                    v-for="detail in project.details"
                    :key="detail"
                  >
                    {{ detail }}
                  </li>
                </ul>
                <div
                  v-if="project.links"
                  class="project-links"
                >
                  <a
                    v-for="link in project.links"
                    :key="link.url"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ link.label }}
                    <span
                      class="icon external-arrow"
                      aria-hidden="true"
                    ></span>
                  </a>
                </div>
                <div
                  v-if="project.outcome"
                  class="project-outcome"
                >
                  <strong>{{ project.outcome.value }}</strong>
                  <span>{{ project.outcome.label }}</span>
                </div>
                <div
                  class="project-skills"
                  aria-label="사용 기술"
                >
                  <span
                    v-for="skill in project.skills"
                    :key="skill"
                    class="skill-tag"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </section>
      </section>

      <div class="qualifications-grid">
        <section
          id="education"
          aria-labelledby="education-heading"
        >
          <div class="section-heading">
            <h2
              id="education-heading"
              class="section-label"
            >
              EDUCATION_
            </h2>
            <span class="qualification-caption">최종 학력</span>
          </div>
          <article
            v-for="item in education"
            :key="item.id"
            class="qualification-card"
          >
            <div class="qualification-card-header">
              <h3>{{ item.school }}</h3>
              <span class="qualification-badge">{{ item.status }}</span>
            </div>
            <p class="qualification-detail">{{ item.major }} · {{ item.degree }}</p>
            <p class="qualification-period">{{ item.period }}</p>
          </article>
        </section>

        <section
          id="certifications"
          aria-labelledby="certifications-heading"
        >
          <div class="section-heading">
            <h2
              id="certifications-heading"
              class="section-label"
            >
              CERTIFICATIONS_
            </h2>
            <span class="qualification-caption">자격증</span>
          </div>
          <article
            v-for="item in certifications"
            :key="item.id"
            class="qualification-card"
          >
            <div class="qualification-card-header">
              <h3>{{ item.name }}</h3>
              <span class="qualification-badge">취득</span>
            </div>
            <p class="qualification-detail">{{ item.issuer }}</p>
            <p class="qualification-period">{{ item.date }}</p>
          </article>
        </section>
      </div>

      <footer class="document-footer">
        <span>REVE / CAREER</span>
        <span>{{ profile.name }} · 경력기술서</span>
      </footer>
    </article>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { certifications, education, experience, profile } from '../data/resume'

const preview = ref(false)
const printResume = () => window.print()
</script>
