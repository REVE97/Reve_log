---
title: "Vue의 반응성, 화면에 데이터가 도착하기까지" # 포스팅 제목
date: 2026-09-09 # 작성 일자
category: Trouble Shooting # 카테고리 
tags: [Vue, JavaScript, 상태 관리] # 태그 
summary: "API 응답 전후의 상태를 나누고, 로딩·빈 결과·오류를 명확하게 표현하는 방법을 정리합니다." # 요약
cover: ./state-flow.svg # 썸네일 이미지
sample: true # 테스트 글인지 유무
---
# Vue의 반응성, 화면에 데이터가 도착하기까지

> **기록 유형** : Trouble Shooting · 테스트용 예제  
> **주요 내용** : 비동기 데이터와 화면 상태 분리  
> 이 글은 Markdown 표시를 확인하기 위한 설명용 예제이며, 실제 프로젝트의 장애·성과 기록이 아닙니다.

<!-- 이미지 첨부 예시 -->
![요청 시작부터 성공 또는 실패까지의 화면 상태 흐름](./state-flow.svg)

---

## 문제를 먼저 정의하기

API 응답이 도착하기 전에는 화면에 필요한 데이터가 아직 없습니다. 이때 데이터를 바로 참조하면 오류가 나거나, 로딩 중인데도 **결과가 없는 화면**이 먼저 보일 수 있습니다.

- 요청 전: 아직 검색하지 않은 상태
- 요청 중: 응답을 기다리는 상태
- 요청 완료: 데이터가 있거나, 결과가 없는 상태
- 요청 실패: 다시 시도할 수 있는 상태

## 원인과 확인 순서

1. 개발자 도구에서 API의 **응답 구조**를 확인합니다.
2. 데이터의 초기값과 응답 이후 값을 비교합니다.
   - 목록은 배열인지 확인합니다.
   - 화면이 먼저 표시되는 동안 `null`에 접근하는지 확인합니다.
3. 로딩·성공·실패 상태가 화면에서 구분되는지 확인합니다.

`optional chaining`은 없는 속성에 접근하는 오류를 피하는 데 도움이 됩니다. 사용자에게 현재 상태를 설명하는 UI도 함께 필요합니다.

## 구현 예제

```javascript
import { ref, computed } from 'vue'

const items = ref([])
const status = ref('idle')
const errorMessage = ref('')
const hasItems = computed(() => items.value.length > 0)

async function loadItems() {
  if (status.value === 'loading') return
  status.value = 'loading'
  errorMessage.value = ''

  try {
    const response = await fetch('/api/items')
    if (!response.ok) throw new Error('목록을 불러오지 못했습니다.')
    const data = await response.json()
    if (!Array.isArray(data.items)) throw new Error('응답 형식을 확인해 주세요.')
    items.value = data.items
    status.value = 'success'
  } catch (error) {
    errorMessage.value = error.message
    status.value = 'error'
  }
}
```

위 코드는 설명용입니다. 이 사이트에서 `/api/items`를 호출하거나 실행하지 않습니다.

## 상태별 화면 확인

| 상태 | 표시할 내용 | 확인할 점 |
| --- | --- | --- |
| idle | 검색 안내 | 아직 요청하지 않았음을 전달 |
| loading | 로딩 안내 | 중복 요청 방지 |
| success · 데이터 있음 | 목록 | 정상 응답 표시 |
| success · 빈 배열 | 결과 없음 | 오류와 구분 |
| error | 오류 안내와 재시도 | 실패 후 복구 가능 |

## 배운 점

**데이터의 값과 요청의 상태를 따로 표현**하면 화면에서 어떤 안내를 보여줄지 명확해집니다. 기능이 동작하는지 확인한 다음, 느린 네트워크와 실패 응답에서도 흐름을 점검해야 합니다.

> 다음 기록에서는 검색 조건이 빠르게 바뀔 때 이전 요청의 응답을 어떻게 처리할지 살펴볼 수 있습니다.

## 참고 자료

- [Vue 공식 문서 · 반응형 기초](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue 공식 문서 · 계산된 속성](https://vuejs.org/guide/essentials/computed.html)
