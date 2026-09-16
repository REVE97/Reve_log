<template>
  <div class="resume-workspace image-pdf-workspace">
    <header class="document-toolbar">
      <div class="breadcrumb">
        <span>REVE</span><span aria-hidden="true">/</span> Labs
        <span aria-hidden="true">/</span> 이미지 PDF 만들기
      </div>
      <button class="button button-secondary" :disabled="busy || !images.length" @click="reset">
        <span class="icon icon-rotate" aria-hidden="true"></span> 초기화
      </button>
    </header>

    <div class="journal-content image-pdf-content">
      <header class="markdown-heading">
        <p class="journal-eyebrow">LABS</p>
        <h1>이미지 PDF 만들기</h1>
        <p class="journal-description">여러 장의 이미지를 하나의 PDF로 정리하세요.</p>
      </header>

      <div v-if="errors.length" class="markdown-feedback is-error" role="alert">
        <p v-for="(error, index) in errors" :key="index">{{ error }}</p>
      </div>
      <p v-if="notice" class="markdown-feedback" role="status">{{ notice }}</p>
      <div v-if="busy" class="image-pdf-progress" role="status" aria-live="polite">
        <div><span>{{ progressLabel }}</span><button class="button button-secondary" :disabled="controller?.signal.aborted" @click="cancel">취소</button></div>
        <progress :value="progress" max="100" aria-label="이미지 처리 진행률"></progress>
      </div>

      <div class="image-pdf-layout">
        <section class="image-pdf-images" aria-labelledby="image-select-title" :aria-busy="busy">
          <div class="markdown-section-heading">
            <h2 id="image-select-title"><span>01</span>이미지 선택</h2>
            <span>{{ images.length }}장</span>
          </div>
          <div class="image-pdf-dropzone" :class="{ 'is-dragging': dragDepth > 0 && !busy }"
            @dragenter.prevent="dragDepth++" @dragover.prevent @dragleave.prevent="dragDepth = Math.max(0, dragDepth - 1)" @drop.prevent="dropFiles">
            <p class="image-pdf-drop-hint">이미지를 놓거나 선택하세요</p>
            <button class="button button-secondary" :disabled="busy" @click="fileInput.click()">
              <span class="icon icon-plus" aria-hidden="true"></span>이미지 추가
            </button>
            <small>JPG · PNG · WebP <span> / 최대 30장 · 파일당 20 MB · 총 150 MB</span></small>
            <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" multiple hidden @change="selectFiles" />
          </div>

          <Draggable v-model="images" item-key="id" tag="ol" class="image-pdf-list"
            handle=".image-pdf-grip" :animation="180" :disabled="busy" :delay="150" :delay-on-touch-only="true"
            ghost-class="image-pdf-ghost" @change="invalidateResult">
            <template #item="{ element: item, index }">
              <li class="image-pdf-row" :class="{ 'is-selected': item.id === selectedId }">
                <span class="image-pdf-grip" title="드래그하여 순서 변경" aria-hidden="true"><span class="icon icon-grip"></span></span>
                <span class="image-pdf-number">{{ String(index + 1).padStart(2, '0') }}</span>
                <button class="image-pdf-thumb" :disabled="busy" :aria-label="`${item.name} 미리보기`" :aria-pressed="item.id === selectedId" @click="selectedId = item.id">
                  <img :src="item.url" alt="" :style="thumbnailStyle(item)" />
                </button>
                <div class="image-pdf-file"><strong :title="item.name">{{ item.name }}</strong><small>{{ formatBytes(item.file.size) }}<span v-if="item.rotation"> · {{ item.rotation }}°</span></small></div>
                <div class="image-pdf-row-actions">
                  <button class="image-pdf-icon-button" :disabled="busy || index === 0" :aria-label="`${item.name} 위로 이동`" title="위로 이동" @click="move(index, -1)"><span class="icon icon-arrow-up" aria-hidden="true"></span></button>
                  <button class="image-pdf-icon-button" :disabled="busy || index === images.length - 1" :aria-label="`${item.name} 아래로 이동`" title="아래로 이동" @click="move(index, 1)"><span class="icon icon-arrow-down" aria-hidden="true"></span></button>
                  <button class="image-pdf-icon-button" :disabled="busy" :aria-label="`${item.name} 시계 방향으로 회전`" title="90° 회전" @click="rotate(item)"><span class="icon icon-rotate" aria-hidden="true"></span></button>
                  <button class="image-pdf-icon-button" :disabled="busy" :aria-label="`${item.name} 삭제`" title="삭제" @click="remove(item)"><span class="icon icon-delete" aria-hidden="true"></span></button>
                </div>
              </li>
            </template>
          </Draggable>
          <div v-if="!images.length" class="image-pdf-empty">
            <span class="icon icon-pdf" aria-hidden="true"></span>
            <p>PDF로 모을 이미지를 추가해 주세요.</p><small>사진을 선택하고 원하는 순서로 정리할 수 있어요.</small>
          </div>
          <p class="image-pdf-note"><span class="icon icon-info" aria-hidden="true"></span>순서대로 한 장씩 PDF 페이지가 됩니다.</p>
        </section>

        <aside class="image-pdf-settings" aria-label="PDF 설정 및 미리보기">
          <button class="image-pdf-settings-toggle" :aria-expanded="settingsOpen" aria-controls="pdf-settings-fields" @click="settingsOpen = !settingsOpen">
            <span><span class="icon icon-settings" aria-hidden="true"></span>PDF 설정</span>
            <small>{{ settingsSummary }}</small><span class="icon icon-chevron-right" :class="{ 'is-open': settingsOpen }" aria-hidden="true"></span>
          </button>
          <h2 class="image-pdf-settings-heading"><span>02</span>PDF 설정</h2>
          <fieldset id="pdf-settings-fields" class="image-pdf-fields" :class="{ 'is-open': settingsOpen }" :disabled="busy">
            <legend class="image-pdf-sr-only">PDF 출력 설정</legend>
            <label class="markdown-field"><span>파일 이름</span><input v-model="settings.filename" maxlength="100" placeholder="my-images.pdf" /></label>
            <label class="markdown-field"><span>페이지 크기</span><select v-model="settings.pageSize"><option value="a4">A4</option><option value="image">이미지에 맞춤</option></select></label>
            <label class="markdown-field"><span>방향</span><select v-model="settings.orientation" :disabled="settings.pageSize === 'image'"><option value="portrait">세로</option><option value="landscape">가로</option></select><small v-if="settings.pageSize === 'image'">이미지 비율에 맞춰 자동으로 정해집니다.</small></label>
            <label class="markdown-field"><span>여백</span><select v-model.number="settings.margin"><option :value="0">없음</option><option :value="5">5 mm</option><option :value="10">10 mm</option><option :value="20">20 mm</option></select></label>
            <label class="markdown-field"><span>화질</span><select v-model="settings.quality"><option value="standard">표준</option><option value="high">고화질</option><option value="small">용량 줄이기</option></select></label>
          </fieldset>

          <button class="button button-secondary image-pdf-preview-toggle" :aria-expanded="previewOpen" aria-controls="pdf-layout-preview" @click="previewOpen = !previewOpen"><span class="icon icon-eye" aria-hidden="true"></span>{{ previewOpen ? '미리보기 접기' : '미리보기' }}</button>
          <div id="pdf-layout-preview" class="image-pdf-preview" :class="{ 'is-open': previewOpen }">
            <p>미리보기</p>
            <div class="image-pdf-paper" :style="paperStyle">
              <img v-if="selectedImage" :src="selectedImage.url" :alt="`${selectedImage.name} 페이지 배치 미리보기`" :style="previewImageStyle" />
              <span v-else class="icon icon-pdf" aria-hidden="true"></span>
            </div>
            <div class="image-pdf-pagination">
              <button class="image-pdf-icon-button" :disabled="selectedIndex <= 0" aria-label="이전 페이지" @click="selectPage(-1)"><span class="icon icon-chevron-right image-pdf-previous" aria-hidden="true"></span></button>
              <span>{{ images.length ? selectedIndex + 1 : 0 }} / {{ images.length }} 페이지</span>
              <button class="image-pdf-icon-button" :disabled="selectedIndex >= images.length - 1" aria-label="다음 페이지" @click="selectPage(1)"><span class="icon icon-chevron-right" aria-hidden="true"></span></button>
            </div>
          </div>
          <div class="image-pdf-export">
            <span>총 <strong>{{ images.length }}</strong>페이지</span>
            <button class="button button-primary" :disabled="busy || !images.length" @click="generatePdf"><span class="icon icon-pdf" aria-hidden="true"></span>{{ generating ? 'PDF 만드는 중…' : 'PDF 만들기' }}</button>
          </div>
          <div v-if="resultUrl" class="image-pdf-result" role="status">
            <p>PDF가 준비되었습니다. <span>{{ formatBytes(resultSize) }}</span></p>
            <a class="button button-secondary" :href="resultUrl" :download="resultName"><span class="icon icon-download" aria-hidden="true"></span>PDF 다운로드</a>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import Draggable from 'vuedraggable'
import imageCompression from 'browser-image-compression'
import compressionWorkerUrl from 'browser-image-compression/dist/browser-image-compression.js?url'
import { imagePageLayout, loadImage, pdfFilename, rotatedJpeg } from '../lib/imagePdf'

const images = ref([])
const selectedId = ref(null)
const fileInput = ref(null)
const importing = ref(false)
const generating = ref(false)
const busy = computed(() => importing.value || generating.value)
const errors = ref([])
const notice = ref('')
const progress = ref(0)
const progressLabel = ref('')
const dragDepth = ref(0)
const settingsOpen = ref(false)
const previewOpen = ref(false)
const resultUrl = ref('')
const resultName = ref('')
const resultSize = ref(0)
const defaults = { filename: 'my-images.pdf', pageSize: 'a4', orientation: 'portrait', margin: 10, quality: 'standard' }
const settings = reactive({ ...defaults })
let controller = null
let disposed = false
let nextId = 0
const selectedIndex = computed(() => Math.max(0, images.value.findIndex(item => item.id === selectedId.value)))
const selectedImage = computed(() => images.value[selectedIndex.value])
const qualityOptions = {
  small: { maxWidthOrHeight: 1600, jpegQuality: 0.72 },
  standard: { maxWidthOrHeight: 2480, jpegQuality: 0.86 },
  high: { maxWidthOrHeight: 3508, jpegQuality: 0.95 },
}
const settingsSummary = computed(() => [settings.pageSize === 'a4' ? 'A4' : '이미지 맞춤', settings.pageSize === 'image' ? '자동' : settings.orientation === 'portrait' ? '세로' : '가로', { small: '작은 용량', standard: '표준', high: '고화질' }[settings.quality]].join(' · '))
const layout = computed(() => {
  const item = selectedImage.value
  const sideways = item?.rotation % 180 !== 0
  return imagePageLayout(item ? (sideways ? item.height : item.width) : 3, item ? (sideways ? item.width : item.height) : 4, settings)
})
const paperStyle = computed(() => ({ aspectRatio: `${layout.value.pageWidth} / ${layout.value.pageHeight}` }))
const previewImageStyle = computed(() => {
  const { pageWidth, pageHeight, imageWidth, imageHeight } = layout.value
  const sideways = selectedImage.value?.rotation % 180 !== 0
  return {
    width: `${(sideways ? imageHeight : imageWidth) / pageWidth * 100}%`,
    height: `${(sideways ? imageWidth : imageHeight) / pageHeight * 100}%`,
    transform: `translate(-50%, -50%) rotate(${selectedImage.value?.rotation || 0}deg)`,
  }
})

function formatBytes(bytes) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
function thumbnailStyle(item) {
  return { transform: `rotate(${item.rotation}deg)`, maxWidth: item.rotation % 180 ? '52%' : '100%', maxHeight: '100%' }
}
function invalidateResult() {
  if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
  resultUrl.value = ''
  notice.value = ''
}
watch(settings, invalidateResult)
function reset() {
  images.value.forEach(item => URL.revokeObjectURL(item.url))
  images.value = []
  selectedId.value = null
  errors.value = []
  invalidateResult()
  Object.assign(settings, defaults)
}
function move(index, direction) {
  const target = index + direction
  if (busy.value || target < 0 || target >= images.value.length) return
  const [item] = images.value.splice(index, 1)
  images.value.splice(target, 0, item)
  invalidateResult()
  notice.value = `${item.name}: ${target + 1}번째 페이지로 이동했습니다.`
}
function rotate(item) {
  item.rotation = (item.rotation + 90) % 360
  selectedId.value = item.id
  invalidateResult()
}
function remove(item) {
  const index = images.value.indexOf(item)
  images.value.splice(index, 1)
  URL.revokeObjectURL(item.url)
  if (selectedId.value === item.id) selectedId.value = images.value[Math.min(index, images.value.length - 1)]?.id ?? null
  invalidateResult()
}
function selectPage(direction) {
  const item = images.value[selectedIndex.value + direction]
  if (item) selectedId.value = item.id
}
function cancel() {
  controller?.abort()
}
function checkCancelled(signal) {
  if (disposed || signal.aborted) throw new DOMException('취소됨', 'AbortError')
}
function selectFiles(event) {
  const files = Array.from(event.target.files || [])
  event.target.value = ''
  addFiles(files)
}
function dropFiles(event) {
  dragDepth.value = 0
  if (!busy.value) addFiles(Array.from(event.dataTransfer.files || []))
}
async function addFiles(files) {
  if (busy.value || !files.length) return
  importing.value = true
  errors.value = []
  invalidateResult()
  controller = new AbortController()
  const { signal } = controller
  progress.value = 0
  let added = 0
  try {
    for (const [index, file] of files.entries()) {
      checkCancelled(signal)
      if (images.value.length >= 30) { errors.value.push('이미지는 최대 30장까지 추가할 수 있습니다.'); break }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        errors.value.push(`${file.name}: JPG, PNG, WebP 파일만 지원합니다. HEIC는 JPG로 변환해 주세요.`)
        continue
      }
      if (file.size > 20 * 1024 * 1024) { errors.value.push(`${file.name}: 파일당 20 MB 이하로 선택해 주세요.`); continue }
      if (images.value.reduce((sum, item) => sum + item.file.size, 0) + file.size > 150 * 1024 * 1024) {
        errors.value.push(`${file.name}: 선택한 파일의 총 용량은 150 MB 이하여야 합니다.`)
        continue
      }
      progressLabel.value = `이미지 확인 중… ${index + 1} / ${files.length}`
      let url
      try {
        const thumbnail = await imageCompression(file, {
          maxWidthOrHeight: 480, fileType: 'image/png', useWebWorker: true,
          libURL: compressionWorkerUrl, signal,
        })
        checkCancelled(signal)
        url = URL.createObjectURL(thumbnail)
        const image = await loadImage(url)
        checkCancelled(signal)
        const item = { id: ++nextId, file, name: file.name, url, width: image.naturalWidth, height: image.naturalHeight, rotation: 0 }
        images.value.push(item)
        if (selectedId.value === null) selectedId.value = item.id
        added++
      } catch (error) {
        if (url) URL.revokeObjectURL(url)
        if (signal.aborted || disposed) throw error
        errors.value.push(`${file.name}: 이미지를 읽을 수 없습니다. 다른 파일을 선택해 주세요.`)
      }
      progress.value = Math.round((index + 1) / files.length * 100)
    }
    notice.value = added ? `${added}장의 이미지를 추가했습니다.` : ''
  } catch {
    if (!disposed) notice.value = '이미지 추가를 취소했습니다. 이미 추가된 이미지는 유지됩니다.'
  } finally {
    importing.value = false
    controller = null
  }
}
async function generatePdf() {
  if (busy.value || !images.value.length) return
  generating.value = true
  errors.value = []
  invalidateResult()
  controller = new AbortController()
  const { signal } = controller
  progress.value = 0
  let currentName = ''
  try {
    const { PDFDocument } = await import('pdf-lib')
    checkCancelled(signal)
    const pdf = await PDFDocument.create()
    const quality = qualityOptions[settings.quality]
    for (const [index, item] of images.value.entries()) {
      currentName = item.name
      checkCancelled(signal)
      progressLabel.value = `PDF 만드는 중… ${index + 1} / ${images.value.length}`
      // Decode and resize one file at a time; workers use the bundled local script.
      const resized = await imageCompression(item.file, {
        maxWidthOrHeight: quality.maxWidthOrHeight, fileType: 'image/png',
        useWebWorker: true, libURL: compressionWorkerUrl, signal,
      })
      checkCancelled(signal)
      const jpeg = await rotatedJpeg(resized, item.rotation, quality.jpegQuality)
      checkCancelled(signal)
      const embedded = await pdf.embedJpg(await jpeg.arrayBuffer())
      const { pageWidth, pageHeight, imageWidth, imageHeight, x, y } = imagePageLayout(embedded.width, embedded.height, settings)
      const page = pdf.addPage([pageWidth, pageHeight])
      page.drawImage(embedded, { x, y, width: imageWidth, height: imageHeight })
      progress.value = Math.round((index + 1) / images.value.length * 95)
      await new Promise(resolve => setTimeout(resolve, 0))
    }
    progressLabel.value = 'PDF 파일 정리 중…'
    const bytes = await pdf.save()
    checkCancelled(signal)
    const blob = new Blob([bytes], { type: 'application/pdf' })
    resultName.value = pdfFilename(settings.filename)
    resultSize.value = blob.size
    resultUrl.value = URL.createObjectURL(blob)
    progress.value = 100
    notice.value = `${images.value.length}페이지 PDF가 준비되었습니다. PDF 다운로드 버튼으로 저장하세요.`
  } catch {
    if (!disposed) {
      if (signal.aborted) notice.value = 'PDF 생성을 취소했습니다. 선택한 이미지는 유지됩니다.'
      else errors.value = [`${currentName ? `${currentName}: ` : ''}PDF를 만들지 못했습니다. 이미지 수를 줄이거나 화질을 낮춘 뒤 다시 시도해 주세요.`]
    }
  } finally {
    generating.value = false
    controller = null
  }
}
onBeforeUnmount(() => {
  disposed = true
  controller?.abort()
  images.value.forEach(item => URL.revokeObjectURL(item.url))
  if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
})
</script>
