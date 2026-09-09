---
title: "[JavaScript] Axios" # 포스팅 제목
date: 2026-01-26 # 작성 일자
category: TIL # 카테고리 
tags: [JavaScript, Axios] # 태그 
summary: "Javascript로 HTTP 요청을 통해 REST API를 사용하는 예시" # 요약
sample: false # 테스트 글인지 유무
---

>JavaScript 에서 **HTTP 요청**을 보내기 위한 라이브러리

- Promise 기반 / **REST API 통신**에 최적화

- **`import 'axios' from 'axios'`** 로 사용

## axios.create()

>프로젝트 전용 axios 인스턴스를 하나 만들어서 **공통화 작업**을 하는데 사용

- baseURL 공통화 / timeout(시간 제한), header 기본값 통일

- "Context-Type" : 요청을 보낼때 타입 / Accept : 요청을 받을때 타입

- +) API URL을 **.env 파일에 저장**하고 상수로 **import** 해서 사용 가능 =>
`.env` 파일에 `VITE_API_URL`(VUE3 에서 환경변수 저장시 반드시 `VITE_`로 시작해야함)
-> baseURL 속성에 URL을 직접 입력하지 않고 **`import.meta.env.VITE_API_URL`**로 사용

**<사용 예시>**

<**`src/api/http.js`**>

```
export const api = axios.create({
  baseURL: "http://localhost:9100/api/",
  timeout: '1000',
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const multiAPi = axios.create({
  baseURL: "http://localhost:9100/api/",
  timeout: '1000',
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
});
```

<**`src/api/post.js`**>

```
import { api } from "./http";

// CREATE
export const createPost = (payload) => {
  // payload: { title, content }
  return api.post("/posts", payload);
};

// READ (list) -> 전체 목록 조회시 params값 생략가능
export const fetchPosts = (params) => {
  // params: { page, size, keyword }
  return api.get("/posts", { params });
};

// READ (detail)
export const fetchPostDetail = (id) => {
  return api.get(`/posts/${id}`);
};

// UPDATE
export const updatePost = (id, payload) => {
  // payload: { title, content }
  return api.put(`/posts/${id}`, payload);
};

// DELETE
export const deletePost = (id) => {
  return api.delete(`/posts/${id}`);
};
```

<**Vue3 에서 사용 예시**>


```
import { ref, onMounted } from "vue";
import { fetchPosts, createPost } from "@/api/posts";

const posts = ref([]);

onMounted(async () => {
  const res = await fetchPosts({ page: 1, size: 10 });
  posts.value = res.data;
});

const onCreate = async () => {
  await createPost({ title: "제목", content: "내용" });
};
```


### application/json , multipart/from-data

>**application/json** : 텍스트 기반 데이터(객체/배열)을 보낼때 사용 
-> 서버가 req.body를 JSON 파서로 바로 해석

>**multipart/form-data** : 파일(이미지/첨부파일) 같은 바이너리와 텍스트를 한 번에 보낼때 사용
-> 브라우저에서 `Formdata` 를 사용하며, 요청은 파트(part)로 쪼개져서 전송


## Vue3 템플릿 사용

**json**

```
[
  { "id": 1, "title": "홍길동", "email": "hong@test.com" },
  { "id": 2, "title": "김철수", "email": "kim@test.com" }
]

```

**users.value**

```
[
  { id: 1, title: "홍길동" },
  { id: 2, title: "김철수" }
]

```

**개별 필드 접근 예시**

```
console.log(users.value[0].title); // "홍길동"
console.log(users.value[1].email); // "kim@test.com"
```


**Vue 파일**

```
<template>
  <div v-if="loading">로딩 중...</div>
  <div v-if="error">{{ error }}</div>

  <ul>
    <li v-for="user in users" :key="user.id">
      {{ user.title }} - {{ user.email }}
    </li>
  </ul>
</template>
```

**GET**

```
const users = ref([]);
const loading = ref(false);
const error = ref(null);

const fetchUsers = async () => {
  loading.value = true;
  error.value = null;

  try {
    const res = await axios.get("/api/users");
    users.value = res.data; // 서버 데이터 저장
  } catch (e) {
    error.value = e.response?.data?.message || e.message;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchUsers);
```

**POST**

**<application/json>**

```
const newUser = ref({
  title: "",
  email: ""
});

const createUser = async () => {
  loading.value = true;

  try {
    const res = await axios.post("/api/users", newUser.value);

    // 서버가 생성된 유저 반환 시 리스트에 추가
    users.value.push(res.data);
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

```

**<multipart/form-data>**

```
<form @submit.prevent="submitForm">
  <input type="text" v-model="title" placeholder="제목" />
  <input type="file" @change="onFileChange" />
  <button type="submit">업로드</button>
</form>
```

```
import { ref } from "vue";
import axios from "axios";

const title = ref("");
const file = ref(null);

const onFileChange = (e) => {
  file.value = e.target.files[0];
};

const submitForm = async () => {
  const formData = new FormData();
  formData.append("title", title.value);
  formData.append("file", file.value);

  try {
    const res = await axios.post(
      "/api/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};
```



**PUT**

```
const updateUser = async (id, updatedData) => {
  loading.value = true;

  try {
    const res = await axios.put(`/api/users/${id}`, updatedData);

    // 기존 리스트에서 교체
    const index = users.value.findIndex(user => user.id === id);
    if (index !== -1) {
      users.value[index] = res.data;
    }
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

```

**DELETE**

```
const deleteUser = async (id) => {
  loading.value = true;

  try {
    await axios.delete(`/api/users/${id}`);

    // 화면에서도 제거
    users.value = users.value.filter(user => user.id !== id);
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

```

**TEST API SITE : https://jsonplaceholder.typicode.com/**


