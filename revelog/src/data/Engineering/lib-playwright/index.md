---
title: "[라이브러리] Playwright" # 포스팅 제목
date: 2026-06-23 # 작성 일자
category: 기술 분석 # 카테고리 
tags: [Vue, 라이브러리, 자동화] # 태그 
summary: "웹 브라우저를 자동으로 조작해서 테스트하는 라이브러리 (사람이 직접 브라우저에서 하는 동작을 코드로 자동화" # 요약
cover: ./playwright.png # 썸네일 이미지
sample: false # 테스트 글인지 유무
---

## Playwright
>웹 브라우저를 자동으로 조작해서 테스트하는 라이브러리 (사람이 직접 브라우저에서 하는 동작을 코드로 자동화)

- 주로 **E2E 테스트**에 사용
- **E2E 테스트** : 사용자가 사용하는 **전체 시스템의 흐름대로 처음부터 끝까지 테스트**하는 방식
- **도입 장점** : 매일 개발자가 상용 서비스에 접속하여 하나씩 테스트 하지않아도 자동화 시스템을 도입해놓으면 개발자가 놓치는 오류도 발견이 가능하고 **유지보수 시간도 단축**할 수 있음
- 테스트 중 발생한 이벤트에 대한 **로그 파일, 화면 캡처, 영상 파일** 생성 가능
- **Chromium, Firefox, Webkit(Safari)** 브라우저 환경 지원

---

## 실제 업무 도입
- 천재교과서·해법교육·상용 화상 서비스 페이지 및 관리자 페이지의 일일 시스템 점검을 위한 E2E 테스트 자동화 프로그램 도입
- 로그인, 메뉴 이동, 검색, 상세 조회, API 호출 정상 여부 확인 등 반복 검증 시나리오를 자동화하여 수동 점검 부담과 유지보수 시간을 단축

---

## 구현 방식
- 별도의 테스트 프로젝트를 생성하여 테스트 코드를 작성하고 명령어를 통해 실행하는 방식
- 매일 자동으로 일정 시간에 실행하려면 `Github Actions`, `Jenkins` 같은 별도 스케줄러 도구 활용

---

## 주의 사항
- 배포된 운영 서버에 자동화 테스트 시 파일 업로드, 수정 · 삭제 테스트 시 불필요한 데이터가 지속적으로 생성되거나 잘못 수정 · 삭제될 수 있음

---

## 주요 활용 Playwright method
- `page` vs `browser` : 
	-`page` 는 하나의 탭에서 테스트할때 사용, 
    -`browser` 는 브라우저에서 여러 탭을 생성하여 테스트 할때 사용
- `page` : **Playwright 테스트 실행 중에만 제공**되는 브라우저 페이지 객체 (하나의 브라우저 탭)
- `page` 에는 미리 아래의 코드가 포함되어 있음
```
const context = await browser.newContext();
const page = await context.newPage();
```
- `browser` : 브라우저 자체로 직접 `context를` 생성하고 여러 `page`를 만들 수 있음
```javascript
test("multi page test", async ({ browser }) => {
  const context = await browser.newContext();

  const page1 = await context.newPage();
  const page2 = await context.newPage();

  await page1.goto("/host");
  await page2.goto("/guest");
});
```

- 테스트용 카메라 및 마이크 설정 하는법
```javascript
test.use({
  permissions: ["camera", "microphone"],
  launchOptions: {
    args: [
      // 미디어 제어 테스트용 옵션
      "--use-fake-ui-for-media-stream",
      "--use-fake-device-for-media-stream",

      // 화면 공유 테스트용 옵션
      "--enable-usermedia-screen-capturing",
      "--auto-select-desktop-capture-source=share-target-tab",
    ],
  },
});
```

### Playwright Locator method
>화면에서 어떠한 요소를 찾는 메서드 ex. input, button, text, table, modal

#### getByTestId()
- 페이지 코드 태그에 `data-testid` 속성을 추가하여 사용

테스트 코드
```javascript
await page.getByTestId("login-id-input");
```
페이지 코드
```javascript
<input data-testid="login-id-input" />
```

#### getByPlaceholder()
- 배포된 서버에 `data-testid` 속성이 없을 때 사용

테스트 코드
```javascript
await page.getByPlaceholder("아이디를 입력해주세요.").fill("ID");
await page.getByPlaceholder("비밀번호를 입력해주세요.").fill("PW");
```

페이지 코드
```javascript
<input placeholder="아이디를 입력해주세요." />
<input placeholder="비밀번호를 입력해주세요." />
```


#### getByRole()
- **버튼, 링크, 체크박스, 라디오, 텍스트박스** 같은 역할 기준으로 요소를 찾아서 사용

테스트 코드
```javascript
await page.getByRole("button", { name: "로그인" }).click();
await page.getByRole("link", { name: "서비스 관리" }).click();
await page.getByRole("textbox", { name: "아이디" }).fill("ID");
```
페이지 코드
```javascript
<button>로그인</button>
```

#### getByText()
- **화면에 보이는 텍스트**로 요소를 찾아서 사용
- 부분 일치나 정규식도 사용 가능
- `exact: true` 를 이용해 정확한 텍스트 확인 가능 

테스트 코드
```javascript
await expect(page.getByText("서비스 이용건수")).toBeVisible();
await expect(page.getByText("로그인에 실패했습니다.")).toBeVisible();

await expect(page.getByText(/검색 결과가 없습니다.|검색해주세요./)).toBeVisible();

await expect(guestPage01.getByText("1234", { exact: true })).toBeVisible();
```

#### locator()
- **CSS 선택자**로 요소를 찾아서 사용
- 앞선 메서드들로 찾기 어려울 때 사용

테스트 코드
```javascript
await page.locator(".error").click();
await page.locator("input[type='password']").fill("PW");
await page.locator("table tbody tr").first().click();
```

### 요소 조작 메서드
>**Locator 메서드로 요소를 찾은 뒤에 조작**하기 위해 사용

#### fill()
- `input` 값을 입력, 기존 값이 있으면 지우고 새 값으로 채운다

```javascript
await page.getByPlaceholder("아이디를 입력해주세요.").fill("ID");
```

#### click()
- 버튼, 링크, 체크박스 등을 클릭한다
```javascript
await page.getByRole("button", { name: "로그인" }).click();
```

#### selectOption()
- select 박스에서 option 을 선택

```javascript
await page.getByTestId("usecase-year-select").selectOption("2026");
await page.getByTestId("usecase-month-select").selectOption("6");
```

#### check() / uncheck()
- 체크박스나 라디오 버튼을 체크하거나 해제

```javascript
await page.getByRole("checkbox", { name: "동의" }).check();
await page.getByRole("checkbox", { name: "동의" }).uncheck();
```

#### press()
- 키보드 입력을 보낸다 (Enter 키 사용)
```javascript
await page.getByPlaceholder("비밀번호를 입력해주세요.").press("Enter");
```

#### bringToFront()
- 메서드를 실행한 탭을 맨앞으로 가져오고 활성 탭으로 전환
- `browser` 를 이용해 여러 탭에서 테스트할때 사용
```javascript
await guestPage02.bringToFront()
```

### Playwright expect assertion method
>테스트가 성공인지 실패인지 판단하는 검증 메서드

#### toBe
- 변수의 `value` 가 일치하는지 확인

```javascript
expect(parentScriptResponse.status()).toBe(200);
```

#### toBeVisible()
- **요소가 화면에 보이는지** 확인
```javascript
await expect(page.getByText("서비스 이용건수")).toBeVisible();
```

#### toHaveURL()
- **현재 페이지 URL이 기대한 값**인지 확인
```javascript
await expect(page).toHaveURL(/\/main/);

await expect(page).toHaveURL("https://localhost:3000/main/statistics/usecase");
```

#### toHaveCount()
- **locator 가 찾은 요소 개수**를 확인

```javascript
await expect(page.locator(".error")).toHaveCount(0);

await expect(page.locator("table tbody tr")).toHaveCount(10);
```

#### toHaveText()
- **요소의 텍스트가 정확히 기대한 값**인지 확인
```javascript
await expect(page.locator(".error")).toHaveText("로그인에 실패했습니다.");
```

#### toContainText()
- 요소 안에 **특정 텍스트가 포함**되어 있는지 확인

```javascript
await expect(page.locator("table")).toContainText("2026-06-01");
```

#### toBeTruthy
- API 응답값이 `true` 인지 확인
- `response.status()` 메서드 값이 200번대 이면 `response.ok()` 메서드가 `true`, 아니면 `false` 반환

```javascript
async function search(page, api) {
  const [response] = await Promise.all([
    waitApi(page, api),
    page.getByRole("button", { name: "검색" }).click(),
  ]);

  expect(response.ok()).toBeTruthy();

  return response;
}
```

### 페이지 대기/라우팅 관련 메서드

#### page.goto()
- **특정 페이지로 이동**

```javascript
await page.goto("/");
```

#### page.waitForResponse()
- 특정 API 응답을 기다린다
- 주로 로그인 API가 실제로 호출됐는지 확인할때 사용
- 응답값을 Promise 객체로 받아서 해당 API 호출 시 변수에 할당하여 사용
- `url` , `status`, `ok` 등의 메서드를 사용

```javascript
// 예시 1번
const responsePromise = page.waitForResponse((response) =>
  response.url().includes("/auth/login") && response.status() === 200
);

await page.getByRole("button", { name: "로그인" }).click();

const response = await responsePromise;

// 예시 2번
const parentScriptResponsePromise = parentPage.waitForResponse(
    (response) => response.url() === KNOWLEDGETALK_JS_URL
  );

await parentPage.goto(parentUrl);

const parentScriptResponse = await parentScriptResponsePromise;

expect(parentScriptResponse.status()).toBe(200);


```

#### page.waitForTimeout
- 해당 페이지에서 할당된 시간만큼 대기
- `value` 는 기본적으로 `ms` 단위 (Ex. 3000 == 3초)

```javascript
await parentPage.waitForTimeout(3000);
```


---

## 테스트 실행 순서
- Vue3 프레임워크 + Vite 빌드 환경 기준

1. playwright 라이브러리 설치 `npm init playwright@latest`
2. package.json 파일 script에 명령어 추가
```javascript
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:e2e:headed": "playwright test --headed",
"test:e2e:debug": "playwright test --debug",
"test:e2e:report": "playwright show-report"
```
3. 루트 경로에 테스트 기본 설정 파일 `playwright.config.js` 추가
```js
import { defineConfig, devices } from "@playwright/test";

const now = new Date();

const timestamp = now
  .toISOString()
  .replace(/T/, "_")
  .replace(/:/g, "-")
  .replace(/\..+/, "");

const artifactDir = `test-artifacts/${timestamp}`;

export default defineConfig({
  /* 테스트 파일 기본 경로 */
  testDir: "./tests/e2e",

  /* 각 테스트 하나당 최대 실행시간 (초과시 실패) */
  timeout: 30 * 1000,

  /* 각 테스트 expect 검증 최대 실행시간 (초과시 실패) */
  expect: {
    timeout: 5000,
  },

  /* 
  날짜별 테스트 저장 시 test-results 산출물 · playwright-report 저장 경로 설정
  테스트 실패 시만 리포트 브라우저 실행할 때 open: "on-failure" 로 변경하여 사용
  */ 
  // outputDir: `${artifactDir}/test-results`,
  
  // reporter: [
  //   ["list"],
  //   ["html", { outputFolder: `${artifactDir}/playwright-report`, open: "never" }],
  // ],

  /* playwright-report 출력 형식 */
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report" }],
  ],

  /* 모든 테스트에서 사용하는 공용 브라우저 실행 설정 */
  use: {
    baseURL: "https://scoaching.milkt.co.kr:8443/", // 로컬 서버 테스트시 localhost:포트번호 · 배포 서버 테스트시 해당주소 입력 · 추후 변수로 환경변수 가져와서 사용가능
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  /* 로컬 개발 서버용 설정 (배포된 서버에서 테스트 시 필요없음) */
  // webServer: {
  //   command: "npm run dev",
  //   url: "https://localhost:3000",
  //   reuseExistingServer: true,
  //   timeout: 120 * 1000,
  //   ignoreHTTPSErrors: true,
  // },

  /* 브라우저 환경 세팅 */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
```
4. 기본 경로 tests/e2e 경로에 테스트 코드 추가 _ex.login.spec.js_

```js
// login.spec.js
// 임의로 테스트 실패 산출물 테스트시 아이디, 패스워드를 다르게 설정 후 실행

import { test, expect } from "@playwright/test";

test("login-test", async ({ page }) => {
  await page.goto("/");

  /* 로컬 서버 로그인 테스트 진행 */
  await page.getByTestId("login-id-input").fill("ID");
  await page.getByTestId("login-password-input").fill("PW");
  await page.getByTestId("login-button").click();

  /* 로컬 서버 main 페이지 진입 후 결과 기댓값 */
  await expect(page.getByText("서비스 이용건수")).toBeVisible();
  await page.getByRole("button", { name: "검색" }).click();
  await expect(page.getByText(/검색 결과가 없습니다.|검색해주세요./)).toBeVisible();

  /* 배포 서버 로그인 테스트 진행 */
  await page.getByPlaceholder("아이디를 입력해주세요.").fill("ID");
  await page.getByPlaceholder("비밀번호를 입력해주세요.").fill("PW");
  await page.getByRole("button", { name: "로그인" }).click();

  // 로그인 테스트 결과 기댓값 - 메인페이지 이동
  await expect(page).toHaveURL(/\/main/);

  await expect(page.getByTestId("login-error-message")).toHaveCount(0);
});
```
5. 테스트 코드 실행
- 로컬 서버 - 터미널 1: `npm run dev` -> 터미널 2: `npm run test:e2e` or `npm run test:e2e:ui`
- 배포 운영 서버 - `npm run test:e2e` or `npm run test:e2e:ui`

6. 테스트 산출물 확인

---

## 테스트 산출물 확인
1. test-result 디렉터리 : 테스트 중 실패시 해당 이벤트 오류 산출물
- trace.zip : 테스트 실행 과정을 Trace Viewer를 통해 확인할 수 있는 파일
실행 명령어 : `npx playwright show-trace test-results/폴더명/trace.zip`
- video.wbem : 실패한 테스트 과정 영상
- test-png : 실패한 테스트 결과 스크린샷

2. playwright-report 디렉터리 : 테스트 결과를 사용자가 보기 좋게 정리한 HTML 보고서 폴더
- index.html : `npx playwright show-report` 명령어로 실행 

---

## 트러블슈팅

1. `page.locator()`, `page.getByRole()` 등으로 해당 페이지의 CSS 요소나 버튼 등을 선택할 때
동일한 클래스명을 가진 요소나 아이디 값을 가진 요소, 동일한 `name` 값을 가진 요소가 있으면 오류가 발생하여 `nth`, `first` 메서드를 활용하거나 `exact`, 정규화를 사용하여 정확히 특정하여 해결해야함.

2. `await page.goto("/")` 와 같이 페이지를 이동시킬때 기본적으로 `goto` 메서드는 **해당 페이지에 관련된 DOM, 종속 외부 리소스가 모두 로딩되어야 성공한 것으로 판단**하는데 **불필요한 네트워크 상에서 리소스가 실패하거나 지연되게 되면 테스트시간 초과 등의 테스트 실패가 발생**됨
- 해결방안 : 기본적으로 goto의 매개변수로 `waitUntil: "load"` 값을 가지고 있는데 `"domcontentloaded"` 값으로 변경해주면 DOM만 완성되면 진행하도록 변경하면 해결됨