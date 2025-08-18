# Momentum - TodoList toy project

> **투두 · 일정 · 마이페이지 — 하루를 정리하는 올인원 서비스**

React + Node.js 기반으로 제작된 TodoList 프로젝트로,
오늘의 할 일 관리, 일정 달력, 마이페이지 루틴 시각화를 제공합니다.

---

## Features

### 1. 오늘의 할 일 (TodoPage)

- 하루 단위 집중 뷰: **체크리스트 + 진행률**
- 중요도/완료 상태 기반으로 **우선순위 정리**
- Glass / Gradient UI, 카드 Glow 효과 적용

### 2. 일정 관리 (SchedulePage)

- **월간 달력 + 하루 타임라인** 뷰 제공
- 카테고리(공부, 운동, 알바, 기타)별 일정 관리
- 직접 카테고리 추가 가능
- 일정 알림(Notification API) 지원
- 드래그 & 드롭으로 **일정 순서 변경**

### 3. 마이페이지 (MyPage)

- 할 일 통계:

  - 총 개수, 완료/미완료, 달성률
  - 최근 7일 완료 히스토리
  - 일정 개수 통계

- 꾸준함을 시각화하는 **루틴 보드 레이아웃**

---

## 프로젝트 구조

```bash
TodoList/
 ├── frontend/              # React 기반 프론트엔드
 │   └── src/pages/
 │       ├── OnePage.jsx        # 메인 소개 페이지
 │       ├── TodoPage.jsx       # 오늘의 할 일 관리
 │       ├── SchedulePage.jsx   # 달력/타임라인 일정 관리
 │       └── MyPage.jsx         # 사용자 통계 및 루틴 시각화
 │
 ├── backend/               # Node.js + Express + Prisma + SQLite
 │   ├── prisma/
 │   │   └── schema.prisma      # 데이터 모델 정의
 │   ├── src/
 │   │   ├── server.js          # Express 서버 엔트리
 │   │   ├── routes/            # REST API 라우트 (todo, event, auth)
 │   │   └── libs/prisma.js     # Prisma Client 초기화
 │   └── package.json
 │
 └── README.md
```

---

## 데이터 모델 (Prisma Schema)

```prisma
model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())

  todos  Todo[]
  events Event[]
}

model Todo {
  id        Int      @id @default(autoincrement())
  title     String
  done      Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user   User @relation(fields: [userId], references: [id])
  userId Int
}

model Event {
  id        Int      @id @default(autoincrement())
  title     String
  date      String   // "YYYY-MM-DD"
  time      String?  // "HH:mm"
  createdAt DateTime @default(now())

  user   User @relation(fields: [userId], references: [id])
  userId Int
}
```

---

## 실행 방법

### 1) 프로젝트 클론

```bash
git clone https://github.com/yeverycode/TodoList.git
cd TodoList
```

### 2) 프론트엔드 실행

```bash
cd frontend
npm install
npm start
```

### 3) 백엔드 실행

```bash
cd ../backend
npm install

# 데이터베이스 마이그레이션
npx prisma migrate dev --name init

# 서버 실행
npm run dev
```

---

## Screenshots

- **오늘의 할 일 페이지** — 체크리스트 + 진행률 <img width="2868" height="1444" alt="image" src="https://github.com/user-attachments/assets/4bc0a7b2-624c-45aa-be7f-902de73a08de" />

- **일정 페이지** — 달력 & 타임라인 <img width="2868" height="1438" alt="image" src="https://github.com/user-attachments/assets/880df447-fa6b-4818-af0a-b88e6c133aa2" />

- **마이페이지** — 프로필 & 통계 <img width="2856" height="1432" alt="image" src="https://github.com/user-attachments/assets/e06e123b-ec64-410e-9808-242e70da8219" />

---

## 향후 확장 계획

- 사용자 DB(MySQL/PostgreSQL) 전환
- 백엔드 API 및 프론트 완전 연동
- JWT 인증/보안 로그인 기능 추가
- AI 기반 할 일 추천/일정 최적화 기능
- 팀/협업 보드 확장
