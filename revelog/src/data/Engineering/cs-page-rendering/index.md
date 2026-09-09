---
title: "[CS] 페이지 구조 / 랜더링 방식" # 포스팅 제목
date: 2026-02-02 # 작성 일자
category: TIL # 카테고리 
tags: [CS] # 태그 
summary: "SPA / MPA / CSR / SSR 등 페이지 구조, 랜더링 방식 요약" # 요약
cover: ./page-rendering.jpg # 썸네일 이미지
sample: false # 테스트 글인지 유무
---

## 페이지 구조
>페이지 구조는 **페이지 이동을 누가 제어**하는지에 대한 의미 ( SPA vs MPA )

![](https://velog.velcdn.com/images/zxcv9675/post/af5c2f39-f758-483c-b1fd-b0ad8d2c63d4/image.jpg)

| 구분     | MPA    | SPA     |
| ------ | ------ | ------- |
| 페이지 수  | 여러 개   | 1개      |
| 페이지 이동 | 서버 요청  | JS 처리   |
| 새로고침   | O      | X       |
| UX     | 비교적 느림 | 매우 부드러움 |
| SEO    | 매우 좋음  | CSR은 불리 |
| 구조     | 단순     | 복잡      |

## SPA
>SPA(Single Page Application)은 **페이지는 하나 존재**하고, **화면 전환을 JavaScript가 담당**하는 페이지 구조이다.

>브라우저에 HTML 하나만 업로드, 이후 화면 전환은 페이지 이동이 아니라 화면 교체 형식

### 동작 흐름
>사용자가 사이트 접속 -> 서버가 index.html 응답 -> JavaScript 실행(Vue,React)
-> 버튼 클릭 / Router 실행 시 필요한 데이터만 API 요청 -> 화면만 다시 랜더링 (리랜더링)

### 장단점
>장점 : **페이지 전환이 빠르다**, 프론트/백엔드 완전히 분리 가능
단점 : **초기 로딩 속도 느림**, **SEO에 불리**

## MPA
>MPA(Multi Page Application)은 **페이지마다 HTML이 존재**하고, **화면이 이동할 때마다 서버에서 새 페이지를 받는** 페이지 구조이다.

> 페이지 이동 = 서버 요청, **페이지 이동 시 마다 화면 전체 새로고침 발생**

### 동작 흐름
>사용자가 사이트 접속 -> 서버가 해당 html 파일 생성 후 응답 -> 사용자가 페이지 이동
-> 브라우저 전체 새로고침 -> 해당 html 파일 생성 후 응답 -> 화면 랜더링

### 장단점
> 장점 : **SEO에 매우 유리**, 초기 로딩 빠름
단점 : 페이지 이동 시 **화면 깜빡임 발생**(UX 불편함), 실시간 UI 구현 복잡


## 랜더링 방식
>화면을 구성하는 **HTML을 어디서 생성**하는가에 대한 의미 ( CSR vs SSR vs SSG )

| 항목      | CSR   | SSR   | SSG   |
| ------- | ----- | ----- | ----- |
| HTML 생성 | 브라우저  | 서버    | 빌드 시  |
| 첫 화면 속도 | 느림    | 빠름    | ⭐⭐⭐⭐⭐ |
| 서버 부하   | 매우 낮음 | 높음    | 거의 없음 |
| SEO     | 불리    | 매우 좋음 | 매우 좋음 |
| 실시간 데이터 | ⭕     | ⭕     | ❌     |
| 배포 난이도  | 쉬움    | 보통    | 쉬움    |

## CSR 
>CSR(Client Side Rendering)은 랜더링을 **브라우저가 담당**, **대부분의 SPA 구조는 CSR기반**

![](https://velog.velcdn.com/images/zxcv9675/post/40dfe528-fa9e-473e-8ca5-2d174b3b1306/image.avif)

### 동작 흐름
>서버가 빈 HTML + JS 파일 -> 브라우저가 JS 파일 다운로드 -> JS 실행 -> API 호출 -> 받아온 데이터로 HTML 파일을 브라우저에서 생성

### 장단점
>장점 : 프론트 개발 자유도 높음, **API 중심 아키텍처에 적합**
단점 : **첫 화면 로딩이 느림**, JS 오류 = 전체 오류

## SSR
>SSR(Server Side Renering)은 **HTML 파일을 서버에서 완성**시켜서 주는 방식

![](https://velog.velcdn.com/images/zxcv9675/post/a4b56f44-8221-42d9-97ea-a17a5282cce0/image.avif)

### 동작 흐름
>사용자가 페이지 요청 -> 서버가 API 호출 -> HTML 파일을 서버가 완성 -> 브라우저에 HTML 전달 ->
이후 JS 파일 적용 후 동작

### 장단점
>장점 : 첫 화면이 매우 빠름, **SEO 최적화**
단점 : **서버 부하 증가**, 배포 구조가 까다로움 

## SSG
>SSG(Static Site Generation)은 **빌드 시점에 모든 페이지의 HTML를 미리 생성**해두고, 요청 시 즉시 제공하는 랜더링 방식

![](https://velog.velcdn.com/images/zxcv9675/post/f7c1d4af-9742-46b6-9473-96653500d23f/image.jpg)

### 동작 흐름
>빌드 시작(npm run build) -> 서버/API에서 데이터 미리 가져온다 -> 모든 페이지 HTML 생성 -> CDN에 업로드 -> 사용자 요청 - HTML 즉시 제공

### 장단점
>장점 : **SEO에 매우 유리**, 정적 호스팅 가능
단점 : 실시간 데이터 부적합(사용자별 데이터, 로그인 처리 불가), 데이터 내용 변경시 전체 빌드 필요


## 관계 정리
>SPA + CSR = 일반 VUE/REACT (관리자 페이지, 사내 시스템)
SPA + SSR = Nuxt/Next (포털 사이트, 쇼핑몰, 블로그)
SSG = 기술 블로그, 회사 소개 페이지
MPA + SSR = JSP/Thymeleaf 

## SEO
>SEO(Search Engine Optimization)은 검색엔진이 **웹페이지를 잘 수집,이해,노출할 수 있도록 최적화**하는 작업

### 검색 엔진 구조
>**Crawling(수집)** : 검색엔진이 방문, HTML 문서읽기
**Indexing(분석,저장)** : HTML 구조 분석, 제목/본문/링크 저장
**Ranking(순위 결정)** : 검색어와의 연관 판단, 품질/속도/구조 평가

### 프론트엔드 관점
>해당 웹페이지의 **JS가 동작하지 않아도 검색엔진이 페이지 내용을 잘 이해**할 수 있도록 해야한다.

### SEO에 유리한 요소
>시맨틱 태그(`header`, `main`, `section`, `article`, `footer` 등)
URL 구조
페이지 속도
반응형, viewport 설정







