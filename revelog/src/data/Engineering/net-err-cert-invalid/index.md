---
title: "[Trouble Shooting] NET::ERR_CERT_~_INVALID 오류" # 포스팅 제목
date: 2026-02-09 # 작성 일자
category: Trouble Shooting # 카테고리 
tags: [트러블슈팅] # 태그 
summary: "프로젝트 진행 도중 갑자기 API 호출이 안되며 해당 API의 CDN 도메인에 접속하면 오류 메시지가 출력되는 현상이 발생" # 요약
cover: ./net-err-cert-invalid.jpeg # 썸네일 이미지
sample: false # 테스트 글인지 유무
---

## 문제 상황
>프로젝트 진행 도중 갑자기 API 호출이 안되며 해당 API의 CDN 도메인에 접속하면
오류 메시지가 출력되는 현상이 발생

```
// 오류 메시지 예시

NET::ERR_CERT_DATE_INVALID

NET::ERR_CERT_AUTHORITY_INVALID

NET::ERR_CERT_COMMON_NAME_INVALID
```

## 초기 원인 추정
>**도메인 오타** 또는 **API 서버 네트워크 문제**라 생각하여 코드를 다시 작성하고 개발 서버를 재가동 하였으나
해결되지 않아 서버의 문제라 파악하여 로그를 파악해본 결과 **인증서 관련 문제로 추정**하였다.

## 해결 방안
>이러한 문제는 **사내 개발 서버 환경**에서 **자체 서명 인증서를 사용 중**일 때나 **만료된 인증서** 일때
발생하는 것으로 파악되어 _두가지 해결방안을 생각_하였다.

>1. 해당 웹페이지에서 빈 화면을 포커싱하고 **`thisisunsafe`** 를 키보드로 입력 (임시)
-> 사용자가 문제를 인지하고 **위험을 감수하고 우회**하여 접속

>2. 해당 인증서를 재발급 (권장)
-> **해당 인증서를 재발급**하거나 **검증된 CA 인증서 등록**

## 주의 사항
>**HSTS 정책이 걸린 도메인**에서는 사용 불가능 - 경고 화면 자체가 나오지 않음

## 기타
>**HSTS** (HTTPS Strict Transport Security) : 해당 사이트는 **반드시 HTTPS 형식으로 접속해야 되는 보안 정책** -> HTTP에서 HTTPS로 변환 도중 **SSL Strip 공격을 방지**할 수 있음

>**자체 서명 인증서** : 정상적인 CA 인증서가 아닌 로컬 환경이나 사내 테스트 서버에 사용되는 인증서
대표적인 CA 인증서 (DigiCert, GlobalSign, Let’s Encrypt)


