---
title: "[HTML] Table 태그 데이터 연동" # 포스팅 제목
date: 2026-01-30 # 작성 일자
category: TIL # 카테고리 
tags: [Vue, Html, JavaScript] # 태그 
summary: "Vue 프레임워크에서 Table 레이아웃 테스트 예시" # 요약
cover: ./table.png # 썸네일 이미지
---

## Table
>VSOC 플랫폼 고도화 개발 중 Vue 프레임워크를 통해 **REST API로 데이터를 호출**하여 
KATRI 신고 / 외부  취약점 정보 / 보안 이벤트 정보 / 모니터링 리포트 / 권한 관리 탭에서 **table 태그 형태로 조회**하기 위해 테스트 작업

## 사용 방법
>기본적으로 table 태그를 선언하고 table 태그안에 **caption, colgroup, thead, tbody, tfoot, tr, th, td** 등과 같은 태그를 사용하여 테이블 표를 만든다.

>테이블 표를 만들 때 style 속성으로 **`table { border-collapse : collapse; }`** 를 통해서 **이중선을 제거**하여 가독성을 높이는 것이 중요하다

>VSOC 플랫폼에서 사용하기 위해 **v-for 를 통해 데이터들을 출력**하는 테이블을 구성하였다. 추후 REST API가 완성되면 수정할 예정

### 태그, 속성 사용법

#### 태그
-`<caption>` : 표 제목
-`<colgroup>` : 특정 열에 스타일을 지정
-**`<thead>`** : 머리글
-**`<tbody>`** : 본문
-**`<tfoot>`** : 꼬리말
-**`<tr>`** (table row) : 행
-**`<th>`** (table heading) : 행, 열의 제목
-**`<td>`** (table data) : 행의 내용
  
#### 속성
-`<scope="cal" / scope="row">` : 행, 열의 제목
-`<span="numeber">` : colgroup 의 열 갯수
-**`<colspan="number">`** : 열 병합
-**`<rowspan="number">`** : 행 병합

## 예시 코드

**template**

```
<table>
    <caption style="margin: 5px; font-weight: bold;">Table</caption>
    <colgroup>
      <!-- <col span="1" style="background-color: white;"> -->
      <!-- <col span="3" style="background-color: black;"> -->
    </colgroup>
    <thead>
      <tr style="background-color: aqua;">
        <th scope="col">차대번호</th>
        <th scope="col">차량번호</th>
        <th scope="col">차주</th>
        <th scope="col">전화번호</th>
        <th scope="col">등록일</th>
        <th scope="col">사고 유형</th>
        <th scope="col">상태</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in mock_table" :key="item.id">
        <td>{{ item.vin }}</td>
        <td>{{ item.vrn }}</td>
        <td>{{ item.person }}</td>
        <td>{{ item.tel }}</td>
        <td>{{ item.date }}</td>
        <td>{{ item.con }}</td>
        <td>{{ item.status }}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="7" style="background-color: #ccc;">마지막 페이지</td>
      </tr> 
    </tfoot>
  </table>
```

**API 호출 전 mock data**

```
const mock_table = reactive([
  {
    id: "1",
    vin: "EDG5235234",
    vrn: "01가1234",
    person: "A123456",
    tel: "01012345678",
    date: "2025-12-03",
    con: "안전사고",
    status: "승인 대기"
  },
  {
    id: "2",
    vin: "EDG5235235",
    vrn: "12나5678",
    person: "A123457",
    tel: "01023456789",
    date: "2025-12-04",
    con: "차량 점검",
    status: "승인 완료"
  },
  {
    id: "3",
    vin: "EDG5235236",
    vrn: "23다9012",
    person: "A123458",
    tel: "01034567890",
    date: "2025-12-05",
    con: "보험 접수",
    status: "반려"
  },
  {
    id: "4",
    vin: "EDG5235237",
    vrn: "34라3456",
    person: "A123459",
    tel: "01045678901",
    date: "2025-12-06",
    con: "사고 조사",
    status: "승인 대기"
  },
  {
    id: "5",
    vin: "EDG5235238",
    vrn: "45마7890",
    person: "A123460",
    tel: "01056789012",
    date: "2025-12-07",
    con: "정비 요청",
    status: "승인 완료"
  }
]);
```

**style**

```
table { border-collapse : collapse; } /* 이중선 제거 */

th,td {
  width: 100px;
  height: 50px;
  text-align: center;
  
  border-width: 1px 0;
  border-style: solid;
  border-color: #ccc;
}
```

![](https://velog.velcdn.com/images/zxcv9675/post/23a8cd9a-fb58-4aa4-886e-82f80c30e77e/image.png)

## 추가 (filter method)
>플랫폼에서 사용자가 **특정 조건을 필터링하여 조회**할 때에는 **filter 메서드를 사용**하여 특정 조건에 충족되는 데이터들만을 출력하여 보여줘야한다.

### filter
>일시적인 테스트라면 `const filter_mock = mock_table.filter(item => item.status == "승인 대기"` 와 같이 사용해도 되지만 Vue 프레임워크 에서는 **반응성을 유지**해야 하기 때문에 반드시 **`computed`를 사용**하여 상태 관리를 해야한다.

#### 예시 코드

**script**

```
const filter_mock = computed(() =>
 mock_table.filter(item => item.status == "승인 대기"));
```

**template**

```
<tr v-for="item in filter_mock" :key="item.id">
   <td>{{ item.vin }}</td>
   <td>{{ item.vrn }}</td>
   <td>{{ item.person }}</td>
   <td>{{ item.tel }}</td>
   <td>{{ item.date }}</td>
   <td>{{ item.con }}</td>
   <td>{{ item.status }}</td>
</tr>
```

**실무 코드**

```
const filteredTable = computed(() => {
  return mock_table.filter(item => {
    const matchStatus =
      !selectedStatus.value || item.status === selectedStatus.value;

    const matchKeyword =
      !keyword.value || item.vin.includes(keyword.value);

    return matchStatus && matchKeyword;
  });
});
```
