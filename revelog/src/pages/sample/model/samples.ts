import type { Component } from 'vue'

const components = import.meta.glob<Component>('../examples/*/*.vue', {
  eager: true,
  import: 'default',
})
const sources = import.meta.glob<string>('../examples/*/*.vue', {
  eager: true,
  query: '?raw',
  import: 'default',
})
const reactSources = import.meta.glob<string>('../examples/*/*.jsx', {
  eager: true,
  query: '?raw',
  import: 'default',
})

// 샘플 추가 리스트
// 입력 순서 : 컴포넌트명, 제목, 필터링 카테고리, 종류명, 설명
const definitions = [
  // Button
  ['HoverButton', 'Hover Button', 'Button', 'Button', 'Hover 기본 버튼'],
  ['SocialButton', 'Social Button', 'Button', 'Button', '소셜미디어 기본 버튼'],
  ['DefaultTooltip', 'Tooltip Button', 'Button', 'Tooltip', '툴팁 기본'],
  ['HoverBackButton', 'Hover Back Button', 'Button', 'Button', 'Hover 기본 뒤로 가기 버튼 (뒤로 이동하는 동작은 직접 구현 필요)'],

  // Input
  ['FormInput', 'Form Input', 'Input', 'Input', 'Form 기본 인풋'],
  ['MessageInput', 'Message Input', 'Input', 'Input', '메시지 및 파일첨부 기본 인풋'],
  ['DarkmodeToggle', 'Darkmode Toggle', 'Input', 'Toggle', '다크모드 토글 1'],
  ['DefaultCheckbox', 'Default Checkbox', 'Input', 'Checkbox', '기본 체크박스'],

  // Animation
  ['DefaultLoading', 'Default Loading', 'Animation', 'Loading', '기본 로딩 애니메이션 효과'],
  ['DefaultFlipBack', "Default Flip Back", 'Animation', 'Flip Back', '기본 카드 뒤집는 애니메이션 효과']
]

export const samples = definitions.map(([id, name, category, tag, description]) => {
  const directory = category.charAt(0).toLowerCase() + category.slice(1)
  const path = `../examples/${directory}/${id}`

  return {
    id,
    name,
    category,
    tag,
    description,
    component: components[`${path}.vue`],
    source: sources[`${path}.vue`],
    reactSource: reactSources[`${path}.jsx`],
  }
})

