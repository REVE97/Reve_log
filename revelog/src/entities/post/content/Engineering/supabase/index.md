---
title: "[Platform] Supabase" # 포스팅 제목
date: 2026-05-20 # 작성 일자
category: 기술 분석 # 카테고리 
tags: [DB, PostgreSQL] # 태그 
summary: "프론트엔드 개발자가 백엔드 서버를 직접 많이 만들지 않아도 DB, 로그인, 파일 저장, API 기능을 빠르게 사용할 수 있게 해주는 백엔드 플랫폼" # 요약
---

## 개념
>프론트엔드 개발자가 백엔드 서버를 직접 많이 만들지 않아도 **DB, 로그인, 파일 저장, API 기능을 빠르게 사용**할 수 있게 해주는 백엔드 플랫폼(**PostgreSQL 기반** 개발 플랫폼)

**기존 DB API 서버 호출 방식**
```
React/Vue
  ↓ axios 요청
Spring Boot / FastAPI / Node.js
  ↓ SQL 실행
MySQL / PostgreSQL
```

**Supabase 방식**
```
React/Vue
  ↓ Supabase SDK 요청
Supabase
  ↓ 내부적으로 PostgreSQL 접근
PostgreSQL DB
```

## 사용법 (React)

### 패키지 설치
```
npm install @supabase/supabase-js
```

### 초기 설정 파일 생성
- Supabase 플랫폼에서 URL, KEY 발급 / DB TABLE 생성

```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
```

#### 데이터 조회

- `from` / `select` 를 이용하여 사용
- `*` 는 해당 테이블의 모든 데이터를 의미

```js
import supabase from '../api/supabase'

const [test, setTest] = useState([]); 

const getfetch = async () => {
  const { data, error } = await supabase.from("studio").select("*");

  if(error) {
    console.error(error)
  } else {
      console.log(data);
      setTest(data);
    }
}

useEffect(() => {
  getfetch();
},[]);
```

#### 데이터 추가

- `from` / `insert` 를 이용하여 사용
- 보내는 데이터를 확인해야 할 경우에만 `data` 속성 추가로 선언
- `insert` 인수로 
	- 하나의 객체 형태를 보낼때는 해당 변수명 `(payload)` 
 	- 여러 개의 객체를 보낼때는 배열 형태로 전송 `([payload])`

```js
import { createClient } from '@supabase/supabase-js';

const payload = {
  type: 'studio',
  name: '홍대 합주실',
  address: '서울 마포구 ...',
  price: 20000,
}

const postfetch = async () => {
  const { error } = await supabase.from("studio").insert(payload);
}
```

#### 데이터 삭제

- `from` / `delete` / `eq` 를 이용하여 사용
- `eq` : **특정 컬럼 값이 같은** 데이터를 삭제 / neq : 특정 컬럼 값이 같지 않은 데이터를 삭제
- `in` : 여러 값 중 **하나에 해당**하는 데이터를 삭제
- `match` : 여러 컬럼 값에 **일치하는** 데이터를 삭제

```js
import { createClient } from '@supabase/supabase-js';

const postfetch = async () => {
  const { error } = await supabase.from("studio").delete().eq('id',target.id);
}

// in method example

await supabase
  .from("studio")
  .delete()
  .in("id", [1, 2, 3]);
  

// match method example

await supabase
  .from("studio")
  .select("*")
  .match({
    location: "서울",
    category: "photo",
  });


```

---