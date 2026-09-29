<template>
  <div class="demo">
    <div class="segments" aria-label="샘플 보기 방식">
      <button v-for="mode in modes" :key="mode" :aria-pressed="selected === mode" @click="selected = mode">
        {{ mode === '목록' ? '☰' : '▦' }} {{ mode }}
      </button>
    </div>
    <div class="items" :class="{ grid: selected === '그리드' }" aria-label="보기 방식 미리보기">
      <span v-for="item in 3" :key="item">
        항목 {{ item }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const modes = ['목록', '그리드']
const selected = ref('목록')
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
.segments {
  display: inline-flex;
  padding: 3px;
  background: white;
  border: 1px solid #d9dde2;
  border-radius: 6px;
}
button {
  padding: 8px 18px;
  border: 0;
  border-radius: 4px;
  color: #3e5066;
  background: transparent;
}
button[aria-pressed="true"] {
  background: #3e5066;
  color: white;
}
.items {
  display: grid;
  gap: 3px;
  margin: 9px auto 0;
  max-width: 190px;
  font-size: 9px;
}
.items.grid {
  grid-template-columns: repeat(3, 1fr);
}
.items span {
  background: #e9edf3;
  border-radius: 2px;
}
</style>
