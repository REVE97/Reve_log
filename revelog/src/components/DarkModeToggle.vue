<template>
  <button
    type="button"
    class="dark-mode-toggle"
    role="switch"
    aria-label="다크 모드"
    :aria-checked="isDarkMode"
    @click="toggleTheme"
  >
    <span class="dark-mode-toggle__label">
      {{ isDarkMode ? 'Dark mode' : 'Light mode' }}
    </span>
    <span
      class="dark-mode-toggle__track"
      aria-hidden="true"
    >
      <span class="dark-mode-toggle__clouds"></span>
      <span class="dark-mode-toggle__stars"></span>
      <span class="dark-mode-toggle__orb">
        <span class="dark-mode-toggle__moon">
          <span class="dark-mode-toggle__crater"></span>
        </span>
      </span>
    </span>
  </button>
</template>

<script setup>
import { isDarkMode, toggleTheme } from '../lib/theme'
</script>

<style scoped>
.dark-mode-toggle {
  --toggle-day: #3d7eae;
  --toggle-night: #1d2939;
  --toggle-sun: #f5cf56;
  --toggle-moon: #d9e1ed;
  --toggle-crater: #9aa9bd;
  --toggle-cloud: #f3f8ff;
  --toggle-cloud-back: #a8c9e0;
  --toggle-star: #f3f8ff;
  --toggle-shadow: #00000033;
  --toggle-halo: #ffffff1a;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-height: 44px;
  margin-top: 16px;
  padding: 7px 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
}

.dark-mode-toggle:hover {
  color: var(--color-text);
}

.dark-mode-toggle:focus-visible {
  outline: 2px solid var(--color-secondary);
  outline-offset: 4px;
}

.dark-mode-toggle__label {
  white-space: nowrap;
}

.dark-mode-toggle__track {
  position: relative;
  flex-shrink: 0;
  width: 64px;
  height: 30px;
  overflow: hidden;
  border: 1px solid var(--color-border-control);
  border-radius: 999px;
  background: var(--toggle-day);
  box-shadow: inset 0 1px 3px var(--toggle-shadow);
  transition: background-color 250ms ease;
}

.dark-mode-toggle__orb {
  position: absolute;
  z-index: 1;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  overflow: hidden;
  border-radius: 50%;
  background: var(--toggle-sun);
  box-shadow:
    0 1px 3px var(--toggle-shadow),
    0 0 0 6px var(--toggle-halo),
    0 0 0 12px var(--toggle-halo);
  transition: transform 300ms ease;
}

.dark-mode-toggle__moon {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: var(--toggle-moon);
  transform: translateX(100%);
  transition: transform 300ms ease;
}

.dark-mode-toggle__crater {
  position: absolute;
  top: 9px;
  left: 4px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--toggle-crater);
  box-shadow:
    9px 1px 0 -1px var(--toggle-crater),
    5px -6px 0 -2px var(--toggle-crater);
}

.dark-mode-toggle__clouds {
  position: absolute;
  bottom: -7px;
  left: 10px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--toggle-cloud);
  box-shadow:
    14px 3px var(--toggle-cloud),
    27px -1px var(--toggle-cloud),
    40px -8px var(--toggle-cloud),
    6px -5px var(--toggle-cloud-back),
    23px -6px var(--toggle-cloud-back),
    39px -14px var(--toggle-cloud-back);
  transition: transform 300ms ease;
}

.dark-mode-toggle__stars {
  position: absolute;
  top: 7px;
  left: 12px;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: var(--toggle-star);
  box-shadow:
    9px 5px var(--toggle-star),
    -5px 10px var(--toggle-star),
    15px 13px var(--toggle-star),
    18px -2px var(--toggle-star);
  opacity: 0;
  transform: translateY(-20px);
  transition: transform 300ms ease, opacity 250ms ease;
}

.dark-mode-toggle[aria-checked='true'] .dark-mode-toggle__track {
  background: var(--toggle-night);
}

.dark-mode-toggle[aria-checked='true'] .dark-mode-toggle__orb {
  transform: translateX(34px);
}

.dark-mode-toggle[aria-checked='true'] .dark-mode-toggle__moon {
  transform: translateX(0);
}

.dark-mode-toggle[aria-checked='true'] .dark-mode-toggle__clouds {
  transform: translateY(35px);
}

.dark-mode-toggle[aria-checked='true'] .dark-mode-toggle__stars {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 760px) {
  .dark-mode-toggle {
    width: auto;
    margin-top: 0;
    margin-left: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dark-mode-toggle * {
    transition: none;
  }
}

@media print {
  .dark-mode-toggle {
    display: none;
  }
}
</style>
