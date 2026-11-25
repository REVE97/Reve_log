---
title: "[TIL] JAVASCRIPT / TYPESCRIPT" # 포스팅 제목
date: 2026-05-13 # 작성 일자
category: TIL # 카테고리 
tags: [JavaScript, TypeScript] # 태그 
summary: "JavaScript, TypeScript 관련 학습 TIL" # 요약
cover: ./js,ts.png # 썸네일 이미지
---

## 📕 JavaScript

### <span style="color:#963f54">Array Method</span>

#### map()
>원본 배열의 **각 요소를 하나씩 바꿔서 새로운 배열을 만드는** 메서드

- `map` 메서드를 호출한 후에도 원본 배열은 변하지 않는다.

<기본 형태>
```js
array.map((item, index) => {
  return 바꿀값;
});

const numbers = [1, 2, 3];

const result = numbers.map((item) => {
  return item * 2;
});

console.log(result); // [2, 4, 6]
```

<객체 배열에서 원하는 속성만 출력>
```js
const users = [
  { id: 1, name: "김철수" },
  { id: 2, name: "이영희" },
  { id: 3, name: "박민수" }
];

const names = users.map((item) => item.name);

console.log(names); // ["김철수", "이영희", "박민수"]
```
<데이터 가공>
```js
const users = [
  { id: 1, name: "김철수", age: 20 },
  { id: 2, name: "이영희", age: 22 }
];

const result = users.map((item) => {
  return {
    userId: item.id,
    userName: item.name
  };
});

console.log(result);

[
  { userId: 1, userName: "김철수" },
  { userId: 2, userName: "이영희" }
]
```

<실무 예시 코드>
- 서버에서 받은 각 `item` 에 **기존 속성은 그대로 둔 상태**로 **속성 추가하여 새로운 배열**로 생성 

```js
const list = [
  { id: 1, name: "A" },
  { id: 2, name: "B" }
];

const newList = list.map((item) => ({
  ...item,
  checked: false
}));


[
  { id: 1, name: "A", checked: false },
  { id: 2, name: "B", checked: false }
]
```

<실무 예시 코드 2>
- `axios.post` 를 통해 서버에 보낼 `payload` 만들기

```js
const users = [
  { id: "a@test.com", name: "홍길동", role: 2 },
  { id: "b@test.com", name: "김철수", role: 4 }
];

const payload = {
  roleList: users.map((item) => ({
    id: item.id,
    name: item.name,
    vsocRole: item.role
  }))
};

console.log(payload);
```

#### every()
>배열의 모든 요소가 조건을 만족하면 `true` , 하나라도 만족하지 않으면 **즉시** `false` 반환

```js
const arr = [2, 4, 6];
arr.every(n => n % 2 === 0); // true (전부 짝수)

const arr2 = [2, 3, 6];
arr2.every(n => n % 2 === 0); // false (3에서 바로 탈락)
```

- 주로 프론트엔드에서 입력값에 대한 유효성 검사를 할때 사용
- 사용 시 주의할 점 : 빈 배열은 항상 true

#### some()
>배열의 모든 요소 중 하나라도 만족하면 'true'

```js
arr.some(v => v === "ERROR");
```

#### find()
>배열 중 조건을 만족하는 첫 요소 1개를 반환

```js
const firstInvalid = arr.find(v => v === "");
```

#### filter()
>배열 중 조건을 만족하는 것만 추출해서 반환

```js
const invalids = arr.filter(v => v == null || v === "");
```

#### splice()
>배열의 특정 위치에서 요소를 **삭제하거나 추가하거나 교체**하는 메서드

- 메서드 사용시 **원본 배열을 직접 바꾼다**

<기본 문법 사용>
```js
array.splice(시작인덱스, 삭제할개수, 추가할값1, 추가할값2, ...)
```

<삭제 사용>
```js
const arr = [10, 20, 30, 40];
arr.splice(1, 2);

console.log(arr); // [10, 40]
```

<추가 사용>
```js
const arr = [10, 30, 40];
arr.splice(1, 0, 20);

console.log(arr); // [10, 20, 30, 40]
```

<교체 사용>
```js
const arr = [10, 20, 30];
arr.splice(1, 1, 999);

console.log(arr); // [10, 999, 30]
```

#### reduce()
>배열의 요소들을 **하나씩 순회하면서 하나의 결과값 으로 누적**하는 메서드

<기본 문법 사용>
```js
array.reduce((acc, cur) => {
  return 누적결과;
}, 초기값);
```

<합계 구하기>
```js
const numbers = [1, 2, 3, 4];

const sum = numbers.reduce((acc, cur) => {
  return acc + cur;
}, 0);

console.log(sum); // 10
```

<최대값 구하기>
```js
const numbers = [3, 7, 2, 9, 5];

const max = numbers.reduce((acc, cur) => {
  return acc > cur ? acc : cur;
}, numbers[0]);

console.log(max); // 9
```
<객체 배열의 총합 구하기>
```js
const products = [
  { name: "A", price: 1000 },
  { name: "B", price: 2000 },
  { name: "C", price: 3000 }
];

const totalPrice = products.reduce((acc, cur) => {
  return acc + cur.price;
}, 0);

console.log(totalPrice); // 6000
```

<배열을 객체로 바꾸기>
```js
const users = [
  { id: 1, name: "Kim" },
  { id: 2, name: "Lee" },
  { id: 3, name: "Park" }
];

const userMap = users.reduce((acc, cur) => {
  acc[cur.id] = cur.name;
  return acc;
}, {});

console.log(userMap);
// { 1: "Kim", 2: "Lee", 3: "Park" }
```

<실무 코드>
```js
// 분석후 공격가능성/합계 데이터 상태값
const postSum = computed(() => {
  return [
    Number(postData.value.data.postAfElapsedTime),
    Number(postData.value.data.postAfTechnicalExpertise),
    Number(postData.value.data.postAfKnowledgeOfItem),
    Number(postData.value.data.postAfWindowOfOpportunity),
    Number(postData.value.data.postAfEquipment),
  ].reduce(( sum, value ) => sum + value, 0);
});

```

#### foreach()
>배열을 **하나씩 순회하면서 작업 수행**

```js
const arr = [1, 2, 3];

arr.forEach(item => {
  console.log(item);
});
```

#### push(), pop(), shift()

- `push` : 배열 맨 뒤에 요소를 추가
- `pop` : 배열 맨 뒤에 요소를 하나 제거
- `shift` : 배열 첫 번째 요소를 하나 제거


---

### 스프레드 문법(...변수명)
>`...변수명` 은 스프레드 문법(spread syntax)로 **묶여 있는 값을 펼쳐서 꺼내는 문법**이다.

- 배열을 복사/합칠때 사용, 객체에 복사/속성을 추가 할때 사용, 함수 인자로 펼칠때 주로 사용

<배열을 합칠때>
- `concat()` 메서드 처럼 사용

```js
const arr1 = [1, 2];
const arr2 = [3, 4];

const result = [...arr1, ...arr2];
console.log(result); // [1, 2, 3, 4]
```

<객체에 속성 추가할때>
```js
const user = {
  name: "홍길동",
  age: 20
};

const newUser = {
  ...user,
  checked: false
};

console.log(newUser);
// { name: "홍길동", age: 20, checked: false }
```

<객체 값 덮어쓰기>
- 뒤에 쓴 값이 우선됨

```js
const user = {
  name: "홍길동",
  age: 20
};

const newUser = {
  ...user,
  age: 30
};

console.log(newUser);
// { name: "홍길동", age: 30 }
```

<함수 인자에서 사용>

```js
const nums = [3, 7, 2];
const max = Math.max(...nums);

console.log(max); // 7
```

<실무 예시 코드>
- `pinia` 의 `app.js` 파일에서 store 상태 갱신 할때 사용

```js
setLoadingInfo(info) {
  this.loadingInfo = { ...info };
}
```

- 업데이트 페이지에서 기존 데이터 가져올때 사용
```js
// Source 수정에 필요한 Source 상세조회 API 호출
const getfetch_source_detail = async() => {
  try {
    const sourceId = route.params.sourceId;
    const res = await axios.get(`/api/vsoc/ext-vulns/source/${sourceId}`);
    getData.value = res.data.data.extVulnsSource;

    postData.value = { id: Number(route.params.sourceId), ...getData.value }

  } catch (error) {
    console.error(error);
    alert("데이터 불러오기 실패");
  }
}
```

---


### localStorage
>**브라우저에 데이터를 저장**하는 저장소

- 새로고침해도 유지된다.
- 브라우저를 종료하고 다시 실행해도 유지된다.
- **문자열만 저장 가능** -> `JSON.stringify()` 메서드를 통해서 문자열로 변경 후 사용
- **같은 도메인에서만 접근 가능**
- 브라우저 탭을 닫으면 사라지게 하려면 `sessionStorage` 사용 (method 는 동일)

#### localStorage.setItem()
>`localStorage` 에 값을 저장할 때 사용

```js
localStorage.setItem('키', '값')
```

#### localStorage.getItem()
>`localStorage` 에서 값을 꺼낼 때 사용

```js
const userId = localStorage.getItem('userId')

console.log(userId)
```

- 해당 `key` 가 없으면 `null` 이 출력

#### localStorage.removeItem()
>`localStorage` 에서 값을 삭제할 때 사용

```js
localStorage.removeItem('userId')
```

- 전체 `localStorage` 를 삭제할 때에는 `localStorage.clear()` 사용

---

### JSON method

#### JSON.stringify()
>객체나 배열을 문자열로 바꾸는 함수

```js
const user = {
  userId: 'test',
  nickname: '밴드유저',
  isLoggedIn: true,
}

const userString = JSON.stringify(user)

localStorage.setItem('bandiaryLoginUser', userString)

{"userId":"test","nickname":"밴드유저","isLoggedIn":true}
```

#### JSON.parse()
>JSON 문자열을 다시 객체로 바꾸는 함수

```js
const savedUser = localStorage.getItem('bandiaryLoginUser')

'{"userId":"test","nickname":"밴드유저","isLoggedIn":true}'

const parsedUser = JSON.parse(savedUser)

console.log(parsedUser.userId)
console.log(parsedUser.nickname)
```

---

### nextTick()
>상태(state) 가 변경되어 **DOM 업데이트가 예약된 뒤**, **실제 DOM 반영이 끝난 다음 시점에 코드를 실행**하기 위한 함수

>Vue3 프로젝트에서는 기본적으로 성능 최적화를 위해 상태 변경 즉시 DOM을 업데이트 하지 않고 비동기적으로 한 번에 처리 (batch)를 하기 때문에 사용

#### 사용 방법
>**`import { nextTick } from "vue";`**

- Promise 방식

```js
await nextTick();
// 여기서부터 DOM 업데이트 완료
```
- CallBack 방식

```js
nextTick(() => {
  // DOM 접근 가능
});
```

- 미디어 사용 예시 코드

```js
import { ref, nextTick } from "vue";

const inputRef = ref(null);

async function open() {
  isOpen.value = true;
  await nextTick();
  inputRef.value.focus();
}

// 미디어 사용 예시
videoRef.value.srcObject = stream;

await nextTick();
videoRef.value.play();
```

---

## 📘 TypeScript
>`JavaScript` 에 정적 타입 시스템을 추가한 프로그래밍 언어
대부분의 `JavaScript`의 문법을 사용가능하고 코드가 실행되게 전에 **타입 관련 오류 검사를 진행**함

### 실행 구조
>`App.ts` - 타입 검사 + JS로 변환(타입 정보 제거) - 브라우저에서 실행

### 타입 검사 예시
```TypeScript
let age: number = 25;

age = "스물다섯";
// Type Error:
// Type 'string' is not assignable to type 'number'.
```

### 기본 변수 선언
>기본적으로 변수명 뒤에 `:`를 붙여서 선언

```TypeScript
// 문자열
let userName: string = "Kim";

// 숫자
let age: number = 29;

// 참 또는 거짓
let isLoggedIn: boolean = true;

// 배열
let scores: number[] = [90, 85, 100];

// 문자열 배열
let skills: string[] = ["React", "Vue", "TypeScript"];

// null
let selectedUser: null = null;

// undefined
let result: undefined = undefined;

// any : 기본적으로 javascript에서 변수를 생성한 것과 동일하게 여겨짐
// 하지만 코드의 안정성이 떨어지고 결과를 예상하기 힘들어지기 때문에 신중하게 사용
let default: any = { id: "1" };

// unknown : any 타입과 동일하게 변수를 할당하는 것은 동일하지만
// 변수 할당 이후 변수를 사용하기 위해서는 로직에 적합한 타입을 해당 변수가 가지고 있는지 추가적인 검사를 요구
let default: unknown = 10;

console.log(num+10); // 에러발생

if (typeof num === "number") {
  console.log(num+10);
} // 정상 작동
```

### 기본 함수 선언
>기본적으로 함수 선언에서 매개변수 및 함수명 뒤에 `:`를 붙여서 선언
```TypeScript
function add(a: number, b: number): number {
  return a + b;
}

add(10, 20);     // 정상
add("10", "20"); // 타입 오류
```

### 객체, 인터페이스 선언
>실무 프로젝트에서는 데이터 구조를 주로 인터페이스로 타입 선언 후 객체로 주로 사용

- `interface` 를 활용해 해당 객체의 타입을 미리 설정함

```TypeScript
interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

// 정상 선언
const user: User = {
  id: 1,
  name: "Kim",
  email: "kim@test.com",
  isAdmin: false
};

// 오류 발생
const user: User = {
  id: 1,
  name: "Kim"
  // email, isAdmin 속성이 없어 타입 오류
};
```
#### 선택적 ? 속성 사용
>`email?` 와 같이 속성 뒤에 `?` 를 붙이면 해당 속성은 생략가능

#### readonly 속성 사용
>해당 변수를 재할당 하지 못하도록 설정

```TypeScript
interface User {
  readonly id: number;
  name: string;
}

const user: User = {
  id: 1,
  name: "Kim"
};

user.name = "Lee"; // 정상

user.id = 2; // 타입 오류
```

#### Union | 속성 사용
>해당 변수에 여러 타입을 허용하고 싶을 때 사용, **interface 으로 선언된 데이터 변수는 사용 불가능**

```TypeScript
let userId: string | number;

userId = 10;
userId = "user10";
userId = true; // 타입 오류

type UserRole = "ADMIN" | "USER" | "GUEST";

let role: UserRole = "ADMIN";

role = "MANAGER"; // 타입 오류
```

### Generic <T>
>함수나 객체를 정의하는 시점에 특정 타입을 고정하지 않고, **사용하는 시점에 타입을 지정하거나 추론**하도록 설정

- 주로 API 응답 타입, 공통 함수, 재사용 컴포넌트, 상태 관리 라이브러리 등에서 많이 사용
- `T` 대신 사용자가 임의로 이름 변경 가능

```TypeScript
// 일반 함수 (데이터 타입만 다르고 기능은 동일)
function getNumber(value: number): number {
  return value;
}

function getString(value: string): string {
  return value;
}

// 제네릭 사용
function getValue<T>(value: T): T {
  return value;
}

const numberValue = getValue<number>(10);
const stringValue = getValue<string>("hello");
```


---