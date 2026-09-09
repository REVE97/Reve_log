---
title: "[TIL] REACT / ZUSTAND" # 포스팅 제목
date: 2026-05-13 # 작성 일자
category: TIL # 카테고리 
tags: [React, Zustand] # 태그 
summary: "React, Zustand 관련 학습 TIL" # 요약
cover: ./react-zustand.png # 썸네일 이미지
sample: false # 테스트 글인지 유무
---

## 📗 React

- **프로젝트 생성** : `node.js` 설치 - `npm create vite@latest my-app` - Framework React 선택

### 데이터 선언

- Vue : `ref`, `reactive` / React : `useState`
- React 에서는 데이터 값을 직접 변경하지 않고 `setter` 함수를 이용

```js
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  const [user, setUser] = useState({
    name: "홍길동",
    age: 20,
  });
  
  setCount(count + 1);

  return (
    <div>
      <p>{count}</p>
      <p>{user.name}</p>
    </div>
  );
}

export default App;

```

### 이벤트 함수 선언

- Vue : `@click`, `@change` / React : `onClick`, `onChange`, `onSubmit`

```js
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  const increase = () => {
    setCount(count + 1);
  };

  return <button onClick={increase}>증가</button>;
}

export default Counter;
```


### 양방향 바인딩

- Vue : `<input v-model="title" />`
- React : 
```
<input
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```

### computed vs useMemo

- useMemo 함수 내 배열에 선언된 데이터 값이 바뀔때 다시 계산

Vue

```js
<script setup>
import { ref, computed } from "vue";

const price = ref(10000);
const count = ref(2);

const totalPrice = computed(() => {
  return price.value * count.value;
});
</script>
```

React

```js
import { useMemo, useState } from "react";

function PriceExample() {
  const [price, setPrice] = useState(10000);
  const [count, setCount] = useState(2);

  const totalPrice = useMemo(() => {
    return price * count;
  }, [price, count]);

  return <p>총 가격: {totalPrice}</p>;
}

export default PriceExample;
```

### watch vs useEffect

Vue

```js
<script setup>
import { ref, watch } from "vue";

const keyword = ref("");

watch(keyword, (newValue) => {
  console.log("검색어 변경:", newValue);
});
</script>
```

React

```js
import { useEffect, useState } from "react";

function SearchExample() {
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    console.log("검색어 변경:", keyword);
  }, [keyword]);

  return (
    <input
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
    />
  );
}

export default SearchExample;
```


### onMounted vs useEffect

- useEffect 두 번째 인자로 빈 배열을 넣으면 컴포넌트가 처음 랜더링된 뒤 한번만 실행

```js
useEffect(() => {
  // 처음 한 번만 실행
}, []);
```

### API 호출

```js
import { useEffect, useState } from "react";
import axios from "axios";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);

    try {
      const res = await axios.get("/api/posts");
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      {loading && <p>로딩 중...</p>}

      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

export default PostList;
```

### 리스트 랜더링

Vue

```js
<template>
  <div v-for="item in list" :key="item.id">
    {{ item.name }}
  </div>
</template>
```

React

```js
{list.map((item) => (
  <div key={item.id}>
    {item.name}
  </div>
))}
```

### 조건부 랜더링

Vue : `v-if`, `v-else`, `v-show` / React : `삼항 연산자`, `&&`

```js
{isLogin ? (
  <p>로그인 상태입니다.</p>
) : (
  <p>로그인해주세요.</p>
)}
```

### 라우팅

- React 라이브러리에서 페이지 라우팅할때는 URL 경로 위주의 라우팅을 한다

#### 패키지 설치

`npm install react-router-dom`


#### 각 페이지 라우팅 랜더링

`App.jsx`

```js
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import BandRecruitPage from "./pages/BandRecruitPage";
import MyPage from "./pages/MyPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/recruit" element={<BandRecruitPage />} />
      <Route path="/my" element={<MyPage />} />
    </Routes>
  );
}

export default App;
```

#### 페이지 이동

- Vue : `router-link`, `router.push` / React : `Link`, `navigate`
- Link : 단순한 페이지 이동 (새로고침 x) / NavLink : `isActive` 를 활용해 현재 페이지 표시

Link

```js
import { Link } from "react-router-dom";

function Header() {
  return (
    <Link to="/recruit">
      밴드원 모집
    </Link>
  );
}

export default Header;
```

NavLink

```js
import { NavLink } from 'react-router-dom'

function BottomNav() {
  return (
    <nav>
      <NavLink
        to="/home"
        className={({ isActive }) =>
          isActive ? 'nav-item active' : 'nav-item'
        }
      >
        홈
      </NavLink>

      <NavLink
        to="/studio"
        className={({ isActive }) =>
          isActive ? 'nav-item active' : 'nav-item'
        }
      >
        합주실
      </NavLink>
    </nav>
  )
}

export default BottomNav
```

navigate

```js
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const goRecruit = () => {
    navigate("/recruit");
  };

  return (
    <button onClick={goRecruit}>
      모집 페이지 이동
    </button>
  );
}

export default HomePage;
```

#### 상세 페이지 이동

- Vue : `useRoute()` / React: `useParams()`

```js
import { Routes, Route } from "react-router-dom";

import BandRecruitDetailPage from "./pages/BandRecruitDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/recruit/:id" element={<BandRecruitDetailPage />} />
    </Routes>
  );
}

export default App;
```

```js
import { useParams } from "react-router-dom";

function BandRecruitDetailPage() {
  const { id } = useParams();

  return <div>모집글 ID: {id}</div>;
}

export default BandRecruitDetailPage;
```

### 페이지네이션

#### 필요한 데이터 상태값

```js
const [currentPage, setCurrentPage] = useState(1)

const itemsPerPage = 3

```

- currentPage = 현재 보고 있는 페이지 번호 / setCurrentPage = 페이지 번호를 변경하는 함수

#### 전체 페이지 수 구하기

```js
const totalPages = Math.ceil(currentList.length / itemsPerPage)
```

#### 현재 페이지에 데이터 출력

```js
const paginatedList = useMemo(() => {
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  return currentList.slice(startIndex, endIndex)
}, [currentList, currentPage])
```


---


### Toast vs Modal
>`Toast` 는 **간단한 알림** UI 가 필요할 때 사용 / `Modal` 은 **사용자가 선택해야 하는 안내**일때 사용

- Toast 사용 예시 : 회원가입이 완료되었습니다 / 아이디 또는 비밀번호가 일치하지 않습니다.
- Modal 사용 예시 : 이 데이터를 삭제하시겠습니까? / 이전 페이지로 돌아가시겠습니까?

| 구분    | Toast     | Modal          |
| ----- | --------- | -------------- |
| 목적    | 간단한 알림    | 중요한 안내 / 확인    |
| 화면 차단 | 거의 안 함    | 화면을 막음         |
| 닫힘 방식 | 자동 사라짐    | 버튼 클릭 필요       |
| 예시    | “저장되었습니다” | “정말 삭제하시겠습니까?” |

#### react-toastify 라이브러리
>주로 React 에서는 `react-toastify` 라이브러리를 사용해서 구현한다.

```
npm install react-toastify
```

```js
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const handleSave = () => {
    toast.success('저장되었습니다.');
  };

  return (
    <>
      <button onClick={handleSave}>저장</button>
      <ToastContainer />
    </>
  );
}

export default App;
```

---

## 📕 Zustand

>설치 방법 : `npm install zustand`

>Hooks를 기반으로 한 사용하기 쉬운 API로, 작고, 빠르고, 확장 가능한 **React 상태 관리 라이브러리**

### 기본 사용법 (장바구니 예시)

#### Store 생성
`src/store/cartStore.js`

- `create` 함수로 상태 관리 변수 생성
- 상태 변수 안에는 **상태**(cartItems) + **상태를 변경하는 함수**(addItem,removeItem,clearCart) 로 구성됨  
- `set()` 함수는 Zustand 에서 기본적으로 제공하는 함수로 **Store 상태를 변경하는데 사용**
- `state` : Store 의 **현재 상태**를 의미 -> state.변수명 : Store 객체 중 변수명에 해당하는 데이터만 가져오기 -> **매개변수명은 임의로 변경가능**하지만 관례적으로 state 사용 == **`selector` 방식**
- 기본적으로 Zustand는 Pinia와 달리 **getters 항목이 존재하지 않고** `const addItem = useCartStore((state) => state.addItem);` 같은 `selector` 방식을 사용하여 구현

```js
import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cartItems: [],

  addItem: (item) => {
    set((state) => ({
      cartItems: [...state.cartItems, item],
    }));
  },

  removeItem: (id) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    }));
  },

  clearCart: () => {
    set({
      cartItems: [],
    });
  },
}));
```

#### 장바구니 추가
`ProductList.jsx`

```js
import { useCartStore } from './store/cartStore';

function ProductList() {
  const addItem = useCartStore((state) => state.addItem);

  const products = [
    {
      id: 1,
      name: 'MacBook',
      price: 2000000,
    },
    {
      id: 2,
      name: 'iPhone',
      price: 1200000,
    },
  ];

  return (
    <div>
      <h2>상품 목록</h2>

      {products.map((product) => (
        <div key={product.id}>
          <p>
            {product.name} / {product.price.toLocaleString()}원
          </p>

          <button onClick={() => addItem(product)}>
            장바구니 추가
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
```

#### 헤더에 장바구니 숫자 표시하기
`Header.jsx`

```js
import { useCartStore } from './store/cartStore';

function Header() {
  const cartItems = useCartStore((state) => state.cartItems);

  return (
    <header>
      <h1>My Shop</h1>

      <div>
        장바구니 🛒 {cartItems.length}
      </div>
    </header>
  );
}

export default Header;
```


