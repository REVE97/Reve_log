---
title: "[Trouble Shooting] CORS, Axios Method 403(Forbidden) 로그 오류" # 포스팅 제목
date: 2026-03-12 # 작성 일자
category: Trouble Shooting # 카테고리 
tags: [트러블슈팅] # 태그 
summary: "ue3 라이브러리 프론트엔드 환경에서 `vite.config.js` 파일을 통해 **CORS 처리**하여 Axios Method 처리하던 중 **`DELETE` 메서드**가 **`DELETE localhost:4545/api/vsoc/monitoring-report/event/19 403(Forbidden)`** 오류 로그가 발생" # 요약
---

## 문제 상황
>Vue3 라이브러리 프론트엔드 환경에서 `vite.config.js` 파일을 통해 **CORS 처리**하여 Axios Method 처리하던 중 **`DELETE` 메서드**가 **`DELETE localhost:4545/api/vsoc/monitoring-report/event/19 403(Forbidden)`** 오류 로그가 발생

## 초기 원인 추정
>**HTTP 403번 에러는 접근 권한이 없다는 의미**이고 **프론트엔드 포트와 백엔드 API 서버의 포트 번호(Origin)이 다르기 때문에** **`axios baseURL` 경로**나 **로그인 토큰이 필요한지 확인**하였으나 N**ETWORK 로그와 POSTMAN을 통해서 메서드의 동작은 정상적으로 처리되는 것을 확인**하여 프론트에서는 정상적으로 CORS 호출을 하였다는 것을 확인하여 **백엔드 API 서버의 문제임을 확인**하였다.

## 해결 방안
>**백엔드 API 서버 디렉터리**에서 **`@Configuration`, `@EnableWebMvc` 의존성**을 가지고 있는 Config 설정 파일에서 **`.allowedMethods`** 메서드 안에 **해당 오류 메서드가 포함되어 있는지 확인**하고 존재하지 않는 것을 확인하고 **해당 메서드를 추가 해서 해결**하였다.  

<예시 코드>
```java
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        **.allowedOrigins("http://localhost:4545")**
                        **.allowedMethods("GET", "POST", "PUT", "DELETE")**
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```
## 주의 사항
>`"GET"` 메서드는 Simple Request 메서드이기 때문에 따로 프론트에서 CORS 처리를 안해도 메서드 오류가 발생하지 않는다. <-> Preflight Request(OPTIONS) : `"DELETE"`, `"PUT"` , `"POST"`는 경우에 따라 다름(백엔드 코드 확인 필요)
