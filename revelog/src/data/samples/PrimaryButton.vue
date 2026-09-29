<template>
  <div class="demo">
    <button class="action" :class="{ hovered: state === 'Hover' }" :disabled="state === 'Disabled'" @click="count++">
      시작하기
      <span aria-hidden="true">
        →
      </span>
    </button>
    <small aria-live="polite">
      {{ count ? `${count}번 클릭했어요` : '클릭해서 시작해 보세요' }}
    </small>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ state: { type: String, default: 'Default' } })
const count = ref(0)
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
.action {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  border: 0;
  border-radius: 6px;
  background: #3e5066;
  color: white;
  transition: background .15s;
}
.action:hover:not(:disabled), .action.hovered {
  background: #2e3e51;
}
</style>
