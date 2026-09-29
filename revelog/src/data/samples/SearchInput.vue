<template>
  <div class="demo">
    <label class="search">
      <span aria-hidden="true">
        ⌕
      </span>
      <input v-model="query" :disabled="state === 'Disabled'" aria-label="샘플 검색" placeholder="검색어를 입력하세요" />
    </label>
    <small aria-live="polite">
      {{ results.join(' · ') || '검색 결과가 없습니다' }}
    </small>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineProps({ state: { type: String, default: 'Default' } })
const query = ref('')
const results = computed(() => ['Vue', 'React', 'CSS'].filter(item => item.toLowerCase().includes(query.value.toLowerCase())))
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
.search {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #d9dde2;
  border-radius: 6px;
  background: white;
}
.search span {
  font-size: 22px;
  line-height: 1;
}
input {
  width: 100%;
  min-width: 0;
  border: 0;
  background: transparent;
  color: #3e5066;
}
</style>
