<template>
  <div class="demo toggles">
    <label v-for="option in options" :key="option.label">
      <input v-model="option.enabled" type="checkbox" role="switch" />
      <span class="track" aria-hidden="true">
      </span>
      {{ option.label }}
    </label>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const options = ref([{ label: '알림 받기', enabled: true }, { label: '자동 저장', enabled: false }])
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
.toggles {
  display: grid;
  justify-content: center;
  gap: 14px;
}
label {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  cursor: pointer;
}
input {
  position: absolute;
  width: 42px;
  height: 24px;
  margin: 0;
  opacity: 0;
}
.track {
  width: 42px;
  height: 24px;
  border-radius: 20px;
  background: #c8ccd1;
  padding: 3px;
  transition: background .15s;
}
.track::after {
  content: '';
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  transition: transform .15s;
}
input:checked + .track {
  background: #3e5066;
}
input:checked + .track::after {
  transform: translateX(18px);
}
input:focus-visible + .track {
  outline: 2px solid #3e5066;
  outline-offset: 3px;
}
input:disabled + .track {
  opacity: .45;
}
@media (prefers-reduced-motion: reduce) {
  .track, .track::after {
    transition: none;
  }
}
</style>
