---
title: "[Trouble Shooting] SELF_SIGNED_CERT_IN_CHAIN 로그 오류" # 포스팅 제목
date: 2026-02-09 # 작성 일자
category: Trouble Shooting # 카테고리 
tags: [트러블슈팅] # 태그 
summary: "프로젝트를 Github를 통해 git clone 하여 브랜치를 분리하고 npm install 하였을 때 발생" # 요약
cover: ./chain.svg # 썸네일 이미지
---

## 문제 상황
>프로젝트를 Github를 통해 git clone 하여 브랜치를 분리하고 **npm install 하였을 때 발생**함
**설치 소요시간이 너무 소요**되어 문제가 발생

## 초기 원인 추정
>우선 **`npm install --verbose`** 명령어로 어디서 문제가 발생되는지 파악
HTTPS 통신 중 인증서 체인에 자체 서명 인증서가 있거나 SSL 검사, 보안 SW, 사내 프록시, 루트 인증서 미설치를 원인으로 추정

## 해결 방안
>로그 분석 결과 **`npm install`** 명령어를 입력하면 npm은 보통 http://regisrty.npmjs.org 로 HTTPS 요청을 보내는데, 이때 서버가 보내는 **SSL인증서가 정상적이고 신뢰 가능한지 검사**하는데
이 과정에서 오류가 발생하는 것으로 파악된다

>**해결 방안 1** : **명령어를 통해 우회** 하는 방안 (개발 테스트/긴급 설치에 이용)
**`npm config set strict-ssl false`** : ssl 검사를 사실상 건너뛴다
**`npm config set strict-ssl true`** : ssl 검사를 엄격하게 실시한다 (**기본값**)
false 로 우회하여 설치 후에는 보안상 다시 true 값으로 변경하는 것을 권장한다

>**해결 방안 2** : 루트 CA 인증서 (`.crt/.pem`) 을 받아서 등록 (권장)
루트 CA 인증서 파일을 받아서 프로젝트에 저장 후 실행

## 주의 사항
>우회하는 방안으로 오류를 해결할 시 **다른 사용자가 중간에 트래픽을 가로챌 수 있기 때문에 주의**가 필요함

## 기타
>**SSL 인증서** : 서버의 신원을 증명하고 통신을 암호화하는 핵심 보안 수단으로 도메인 이름, 공개키, 발급자(CA) 정보, 유효 기간, 서명 정보 데이터를 가지고 있다. ex. **HTTPS = HTTP + SSL 인증서**
