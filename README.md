# Momentum - TodoList toy project

> **투두 · 일정 · 마이페이지 — 하루를 정리하는 올인원 서비스**

React 기반으로 제작된 TodoList 프로젝트로,
오늘의 할 일 관리, 일정 달력, 마이페이지 루틴 시각화를 제공합니다.

---

## Features

### 1. 오늘의 할 일 (TodoPage)

* 하루 단위 집중 뷰: **체크리스트 + 진행률**
* 중요도/완료 상태 기반으로 **우선순위 정리**
* Glass / Gradient UI, 카드 Glow 효과 적용

### 2. 일정 관리 (SchedulePage)

* **월간 달력 + 하루 타임라인** 뷰 제공
* 카테고리(공부, 운동, 알바, 기타)별 일정 관리
* 직접 카테고리 추가 가능
* 일정 알림(Notification API) 지원
* 드래그 & 드롭으로 **일정 순서 변경**

### 3. 마이페이지 (MyPage)

* 프로필 카드: 사용자 이름, 전공 등 표시
* 할 일 통계:
  * 총 개수, 완료/미완료, 달성률
  * 최근 7일 완료 히스토리
  * 일정 개수 통계
* 꾸준함을 시각화하는 **루틴 보드 레이아웃**

---

## 주요 페이지 구조

```bash
src/pages/
 ├── OnePage.jsx        # 메인 소개 페이지 (오늘의 할 일, 일정, 마이페이지 요약)
 ├── TodoPage.jsx       # 오늘의 할 일 상세 관리
 ├── SchedulePage.jsx   # 달력/타임라인 기반 일정 관리
 └── MyPage.jsx         # 사용자 통계 및 루틴 시각화
```

---

## 실행 방법

### 1) 프로젝트 클론

```bash
git clone https://github.com/yeverycode/TodoList.git
cd TodoList
```

### 2) 패키지 설치

```bash
npm install
```

### 3) 실행

```bash
npm start
```

---

## Screenshots

* **오늘의 할 일 페이지** — 체크리스트 + 진행률
<img width="2868" height="1444" alt="image" src="https://github.com/user-attachments/assets/4bc0a7b2-624c-45aa-be7f-902de73a08de" />

* **일정 페이지** — 달력 & 타임라인
<img width="2868" height="1438" alt="image" src="https://github.com/user-attachments/assets/880df447-fa6b-4818-af0a-b88e6c133aa2" />

* **마이페이지** — 프로필 & 통계
<img width="2856" height="1432" alt="image" src="https://github.com/user-attachments/assets/e06e123b-ec64-410e-9808-242e70da8219" />

---

## 향후 확장 계획

* 사용자 DB 연동 (현재는 LocalStorage 기반)
* 백엔드 API 연계 (Java + MySQL)
