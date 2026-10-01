<template>
  <button
    ref="trigger"
    type="button"
    class="default-tooltip"
    :aria-label="label"
    :aria-describedby="tooltipId"
    @mouseenter="showTooltip"
    @mouseleave="scheduleHide"
    @focus="showTooltip"
    @blur="scheduleHide"
    @click="showTooltip"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"
      ></path>
    </svg>
  </button>

  <!-- 툴팁 내용 -->
  <Teleport to="body">
    <div
      v-show="visible"
      :id="tooltipId"
      ref="popup"
      role="tooltip"
      class="default-tooltip-content"
      :style="position"
      @mouseenter="cancelHide"
      @mouseleave="scheduleHide"
    >
      {{ content }}
    </div>
  </Teleport>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'

defineProps({
  content: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '도움말',
  },
})

const tooltipId = useId()
const trigger = ref(null)
const popup = ref(null)
const visible = ref(false)
const position = ref({})
let hideTimer

function cancelHide() {
  window.clearTimeout(hideTimer)
}

function updatePosition() {
  if (!visible.value || !trigger.value || !popup.value) return

  const anchor = trigger.value.getBoundingClientRect()
  const panel = popup.value.getBoundingClientRect()
  const margin = 16
  const gap = 10
  const left = Math.max(
    margin,
    Math.min(
      anchor.left + anchor.width / 2 - panel.width / 2,
      document.documentElement.clientWidth - panel.width - margin,
    ),
  )
  const below = anchor.bottom + gap
  const top = below + panel.height <= window.innerHeight - margin
    ? below
    : Math.max(margin, anchor.top - panel.height - gap)
  const arrowLeft = Math.max(
    12,
    Math.min(anchor.left + anchor.width / 2 - left, panel.width - 12),
  )

  position.value = {
    left: `${left}px`,
    top: `${top}px`,
    '--tooltip-arrow-left': `${arrowLeft}px`,
    '--tooltip-arrow-top': top === below ? '-4px' : 'calc(100% - 4px)',
  }
}

async function showTooltip() {
  cancelHide()
  visible.value = true
  await nextTick()
  updatePosition()
}

function hideTooltip() {
  cancelHide()
  visible.value = false
}

function scheduleHide() {
  cancelHide()
  hideTimer = window.setTimeout(() => {
    if (document.activeElement !== trigger.value) hideTooltip()
  }, 150)
}

function handleKeydown(event) {
  if (event.key === 'Escape') hideTooltip()
}

function handleOutsidePointer(event) {
  if (!trigger.value?.contains(event.target) && !popup.value?.contains(event.target)) {
    hideTooltip()
  }
}

onMounted(() => {
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('pointerdown', handleOutsidePointer)
})

onBeforeUnmount(() => {
  cancelHide()
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('pointerdown', handleOutsidePointer)
})
</script>

<style scoped>
.default-tooltip {
  display: inline-flex;
  flex: 0 0 32px;
  align-items: center;
  justify-content: center;
  align-self: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--color-border-accent);
  border-radius: 50%;
  background: linear-gradient(
    147deg,
    var(--color-action-bg, var(--color-secondary)),
    var(--color-action-hover, var(--color-secondary-hover))
  );
  color: var(--color-on-accent);
  box-shadow: 0 3px 8px var(--color-shadow-overlay);
  font: inherit;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
}

.default-tooltip svg {
  width: 10px;
  height: 16px;
  fill: currentColor;
}

.default-tooltip:focus-visible {
  outline: 2px solid var(--color-secondary);
  outline-offset: 3px;
}

.default-tooltip:hover svg {
  animation: tooltip-jello 400ms ease;
}

.default-tooltip-content {
  position: fixed;
  z-index: 1000;
  width: max-content;
  max-width: min(280px, calc(100vw - 32px));
  padding: 12px 14px;
  border: 1px solid var(--color-border-accent);
  border-radius: 6px;
  background: var(--color-action-bg, var(--color-heading));
  color: var(--color-on-accent);
  box-shadow: 0 6px 18px var(--color-shadow-overlay);
  font-size: 12px;
  line-height: 1.7;
  text-align: left;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.default-tooltip-content::before {
  position: absolute;
  top: var(--tooltip-arrow-top);
  left: var(--tooltip-arrow-left);
  width: 8px;
  height: 8px;
  background: inherit;
  content: '';
  transform: translateX(-50%) rotate(45deg);
}

@keyframes tooltip-jello {
  0%, 100% {
    transform: scale(1);
  }
  35% {
    transform: scale(0.8, 1.2);
  }
  70% {
    transform: scale(1.1, 0.9);
  }
}

@media (max-width: 760px) {
  :global(.document-toolbar:has(.default-tooltip)) {
    flex-wrap: wrap;
  }

  :global(.toolbar-actions:has(.default-tooltip)) {
    margin-left: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .default-tooltip:hover svg {
    animation: none;
  }
}

@media print {
  .default-tooltip,
  .default-tooltip-content {
    display: none !important;
  }
}
</style>
