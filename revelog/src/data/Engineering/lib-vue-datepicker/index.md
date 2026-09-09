---
title: "[라이브러리] Vue DatePicker 라이브러리" # 포스팅 제목
date: 2026-03-17 # 작성 일자
category: 기술 분석 # 카테고리 
tags: [Vue, 라이브러리] # 태그 
summary: "사용자가 날짜/시간을 입력할 수 있는 UI를 제공하는 라이브러리" # 요약
cover: ./vueDatePicker postImage.png # 썸네일 이미지
sample: false # 테스트 글인지 유무
---

## Vue DatePicker 라이브러리
>기본 HTML DatePicker(`input type="date","time"`) 대신 **CSS를 수정가능한** Vue DatePicker 라이브러리를 사용해서 **사용자가 날짜/시간을 입력할 수 있는 UI를 제공**하는 라이브러리

## 설치
>`npm install @vuepic/vue-datepicker`

## 기본 사용법
```vue
<template>
  <VueDatePicker v-model="date" />
</template>

<script setup>
import { ref } from "vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const date = ref(null);
</script>
```

### 전역 등록 방식
```javascript
import { createApp } from "vue";
import App from "./App.vue";

import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const app = createApp(App);
app.component("VueDatePicker", VueDatePicker);
app.mount("#app");
```

## 주요 속성 정리
>DatePicker 컴포넌트안에 속성값을 부여하여 데이터를 의도한대로 바인딩 가능한 상태로 만든다.

```vue
<DatePicker
  v-model="date"
  format="yyyy-MM-dd"
  model-type="format"
  placeholder="날짜/시간을 선택하세요"
  :enable-time-picker="true"
  :clearable="false"
  :hideInputIcon="true"
  time-picker
  locale="ko"
/>
```

- `v-model` : 양방향 바인딩 데이터 변수명
- `format` : 화면에 랜더링 되는 형식
- `model-type` : 실제로 `v-model` 에 저장되는 값의 형태
- `placeholder` : 바인딩 되고 있는 데이터의 값이 `null` 일때 출력되는 메시지
- `:enable-time-picker` : `time` 값도 포함시킬 것인지 유무
- `:clearable` : DatePicker 입력창 디폴트 오른쪽 버튼(초기화) 유무
- `:hideInputIcon` : DatePicker 입력창 디폴트 왼쪽 달력아이콘 유무
- `time-picker` : DatePicker 을 이용하여 시간 데이터만 바인딩하고 싶을때 사용
- `locale` : DatePicker 입력 내용 설명의 국가 언어
- `auto-apply` : 날짜/시간 고르면 Select 버튼 클릭 없이 입력
- `range` : 날짜/시간 범위로 입력할때 사용


## 기타
- 보통 실무에서는 Vue DatePicker 라이브러리로 날짜/시간 모두 데이터값을 입력받지만
따로 TimePicker 라이브러리만 설치하여 사용할 수도 있다. 