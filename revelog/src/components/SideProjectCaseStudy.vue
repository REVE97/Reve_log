<script setup>
defineProps({
  project: { type: Object, required: true },
  index: { type: Number, required: true },
})
</script>

<template>
  <article
    :id="project.id"
    class="case-study"
    :aria-labelledby="`${project.id}-title`"
  >
    <header class="case-header">
      <p class="section-label">
        SIDE PROJECT_
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
      </p>
      <h2
        :id="`${project.id}-title`"
        class="case-title"
      >
        {{ project.name }}
      </h2>
      <p class="case-subtitle">{{ project.subtitle }}</p>
      <p class="case-period">{{ project.period }}</p>
      <div class="case-meta">
        <div
          class="case-tags"
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
        <a
          :href="project.github"
          class="case-repository"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ project.github.replace('https://', '') }}
          <span
            class="icon external-arrow"
            aria-hidden="true"
          ></span>
        </a>
      </div>
    </header>

    <div
      v-if="project.screens"
      class="case-gallery"
      aria-label="서비스 화면"
    >
      <figure
        v-for="screen in project.screens"
        :key="screen.src"
        class="case-screen"
      >
        <a
          :href="screen.src"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`${project.name} ${screen.label} 원본 이미지 (새 탭)`"
        >
          <img
            :src="screen.src"
            :alt="`${project.name} ${screen.label} 화면`"
          />
        </a>
        <figcaption>{{ screen.label }}</figcaption>
      </figure>
    </div>
    <figure
      v-else-if="project.showcase"
      class="case-showcase"
    >
      <img
        :src="project.showcase.src"
        :alt="project.showcase.label"
      />
      <figcaption>{{ project.showcase.label }}</figcaption>
    </figure>

    <section
      class="case-section"
      :aria-labelledby="`${project.id}-overview`"
    >
      <h3
        :id="`${project.id}-overview`"
        class="case-section-title"
      >
        <span>01</span>
        OVERVIEW_
      </h3>
      <div class="case-overview">
        <p
          v-for="paragraph in project.overview"
          :key="paragraph"
        >
          {{ paragraph }}
        </p>
      </div>
    </section>

    <section
      class="case-section case-section-stacked"
      :aria-labelledby="`${project.id}-features`"
    >
      <h3
        :id="`${project.id}-features`"
        class="case-section-title"
      >
        <span>02</span>
        KEY FEATURES_
      </h3>
      <div class="case-features">
        <div
          v-for="feature in project.features"
          :key="feature.title"
          class="case-feature"
        >
          <h4>
            <span
              :class="['icon', `icon-${feature.icon}`]"
              aria-hidden="true"
            ></span>
            {{ feature.title }}
          </h4>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <section
      class="case-section case-section-stacked"
      :aria-labelledby="`${project.id}-implementation`"
    >
      <h3
        :id="`${project.id}-implementation`"
        class="case-section-title"
      >
        <span>03</span>
        IMPLEMENTATION_
      </h3>
      <div class="case-implementation">
        <div
          v-for="item in project.implementation"
          :key="item.title"
          class="case-implementation-row"
        >
          <h4>
            <span
              :class="['icon', `icon-${item.icon}`]"
              aria-hidden="true"
            ></span>
            {{ item.title }}
          </h4>
          <ul>
            <li
              v-for="detail in item.details"
              :key="detail"
            >
              {{ detail }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <footer class="document-footer">
      <span>REVE / SIDE PROJECT</span>
      <span>곽효재 · 포트폴리오</span>
    </footer>
  </article>
</template>
