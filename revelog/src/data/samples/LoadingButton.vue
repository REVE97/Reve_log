<template>
  <div class="demo">
    <button :disabled="loading" :aria-busy="loading" @click="save">
      <span v-if="loading" class="spinner" aria-hidden="true">
      </span>
      {{ loading ? '저장 중...' : '저장하기' }}
    </button>
    <small role="status">
      {{ message }}
    </small>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'

const loading = ref(false)
const message = ref('클릭하면 저장 과정을 보여드려요')
let timer
function save() {
  loading.value = true
  message.value = '잠시만 기다려 주세요'
  timer = setTimeout(() => {
    loading.value = false
    message.value = '저장되었습니다 (샘플)'
  }, 1200)
}
onBeforeUnmount(() => clearTimeout(timer))
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
button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border: 0;
  border-radius: 6px;
  background: #3e5066;
  color: white;
}
button[aria-busy="true"] {
  opacity: 1;
}
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #ffffff55;
  border-top-color: white;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
  }
}
</style>
