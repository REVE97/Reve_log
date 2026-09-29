<template>
  <div class="demo">
    <div class="chips" aria-label="샘플 분야 필터">
      <button v-for="category in categories" :key="category" :aria-pressed="selected === category" @click="selected = category">
        {{ category }}
      </button>
    </div>
    <small aria-live="polite">
      {{ results.join(' · ') }}
    </small>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const categories = ['전체', '디자인', '개발']
const selected = ref('전체')
const items = [{ name: 'UI 디자인', category: '디자인' }, { name: 'Vue 개발', category: '개발' }]
const results = computed(() => items.filter(item => selected.value === '전체' || item.category === selected.value).map(item => item.name))
</script>

<style scoped>
button, input {
  font: inherit;
}
button {
  cursor: pointer;
}
button:focus-visible, input:focus-visible {
  outline: 2px solid #3e5066;
  outline-offset: 3px;
}
button:disabled, input:disabled {
  opacity: .45;
  cursor: not-allowed;
}
.demo {
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #3e5066;
}
small {
  display: block;
  margin-top: 10px;
  color: #777;
  font-size: 11px;
}
.chips {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
}
button {
  padding: 7px 12px;
  border: 1px solid #d9dde2;
  border-radius: 24px;
  background: white;
  color: #3e5066;
}
button[aria-pressed="true"] {
  background: #3e5066;
  border-color: #3e5066;
  color: white;
}
</style>
