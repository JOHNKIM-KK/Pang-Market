# Pang Market - 모노레포 프로젝트

Next.js (프론트엔드) + Fastify (백엔드) 기반의 마켓플레이스 애플리케이션

## 📁 프로젝트 구조

```
Pang-Market/
├── client/              # Next.js 프론트엔드
│   ├── app/            # Next.js App Router
│   ├── components/     # React 컴포넌트
│   └── lib/           # 유틸리티 & 상태관리
├── server/             # Fastify 백엔드
│   ├── src/           # TypeScript 소스코드
│   │   ├── config/    # 설정 파일
│   │   ├── routes/    # API 라우트
│   │   ├── controllers/ # 비즈니스 로직
│   │   ├── middleware/  # 미들웨어
│   │   └── utils/     # 유틸리티
│   └── prisma/        # Prisma 스키마
└── docker-compose.yml  # PostgreSQL 컨테이너
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 데이터베이스 시작

```bash
# PostgreSQL 컨테이너 실행
docker-compose up -d

# 데이터베이스 마이그레이션
cd server
pnpm db:push
```

### 3. 환경 변수 설정

`server/.env` 파일이 자동으로 생성되어 있습니다. 필요시 수정하세요.

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/pang_market"
JWT_SECRET="dev-secret-key-12345678901234567890"
JWT_REFRESH_SECRET="dev-refresh-secret-key-12345678901234567890"
PORT=3001
NODE_ENV=development
```

### 4. 개발 서버 실행

```bash
# 프론트엔드 + 백엔드 동시 실행
pnpm dev

# 또는 개별 실행
pnpm dev:client  # http://localhost:3000
pnpm dev:server  # http://localhost:3001
```

## 📚 기술 스택

### 프론트엔드 (client/)
- **Framework**: Next.js 16 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **상태관리**: Zustand
- **데이터 페칭**: TanStack Query
- **폼 관리**: React Hook Form + Zod
- **UI 컴포넌트**: shadcn/ui

### 백엔드 (server/)
- **Framework**: Fastify
- **언어**: TypeScript
- **데이터베이스**: PostgreSQL
- **ORM**: Prisma
- **인증**: JWT (@fastify/jwt)
- **비밀번호 해싱**: bcrypt
- **검증**: Zod

## 🔐 API 엔드포인트

### 인증 API (`/api/auth`)

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| POST | `/signup` | 회원가입 | ❌ |
| POST | `/login` | 로그인 | ❌ |
| POST | `/refresh` | 토큰 갱신 | ❌ |
| GET | `/me` | 현재 사용자 정보 | ✅ |
| POST | `/logout` | 로그아웃 | ❌ |

### 예시

**회원가입**
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "홍길동"
  }'
```

**로그인**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**현재 사용자 정보**
```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🛠️ 유용한 명령어

```bash
# Prisma Studio (DB GUI)
pnpm db:studio

# 데이터베이스 마이그레이션 생성
cd server && pnpm db:migrate

# 타입스크립트 컴파일
pnpm build

# PostgreSQL 로그 확인
docker-compose logs -f postgres

# PostgreSQL 중지
docker-compose down

# PostgreSQL 완전 삭제 (데이터 포함)
docker-compose down -v
```

## 📝 개발 가이드

### 새로운 API 엔드포인트 추가

1. `server/src/controllers/` 에 컨트롤러 추가
2. `server/src/routes/` 에 라우트 등록
3. `server/src/app.ts` 에서 라우트 등록

### 데이터베이스 스키마 변경

1. `server/prisma/schema.prisma` 수정
2. `pnpm db:push` 실행 (개발 중)
3. 또는 `pnpm db:migrate` 실행 (프로덕션)

## 🔧 트러블슈팅

### 포트가 이미 사용 중인 경우

```bash
# 포트 사용 프로세스 확인
lsof -ti:3000  # 프론트엔드
lsof -ti:3001  # 백엔드
lsof -ti:5432  # PostgreSQL
```

### 데이터베이스 연결 실패

```bash
# PostgreSQL 컨테이너 상태 확인
docker-compose ps

# 컨테이너 재시작
docker-compose restart postgres
```

### Prisma 클라이언트 에러

```bash
cd server
pnpm db:generate
```

## 📄 라이선스

MIT
