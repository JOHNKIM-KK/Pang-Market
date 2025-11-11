# Pang Market

Next.js + Fastify 기반의 마켓플레이스 애플리케이션

## 📁 프로젝트 구조

```
Pang-Market/
├── client/              # Next.js 프론트엔드
│   ├── app/            # App Router
│   ├── components/     # React 컴포넌트
│   └── lib/           # 유틸리티 & 상태관리
└── server/             # Fastify 백엔드
    ├── src/           # 소스코드
    │   ├── config/    # 설정
    │   ├── routes/    # API 라우트
    │   ├── controllers/ # 비즈니스 로직
    │   ├── middleware/  # 미들웨어
    │   └── utils/     # 유틸리티
    └── prisma/        # DB 스키마
```

## 📚 기술 스택

### 프론트엔드

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (상태관리)
- TanStack Query (데이터 페칭)
- React Hook Form + Zod (폼 관리)

### 백엔드

- Fastify + TypeScript
- PostgreSQL + Prisma
- JWT 인증
- bcrypt (비밀번호 해싱)

## 🚀 시작하기

```bash
# 1. 의존성 설치
pnpm install

# 2. PostgreSQL 시작
docker-compose up -d

# 3. 데이터베이스 마이그레이션
cd server && pnpm db:push

# 4. 개발 서버 실행
pnpm dev
```

- 프론트엔드: http://localhost:3000
- 백엔드: http://localhost:3001

## 🔐 API 엔드포인트

### 인증 (`/api/auth`)

- `POST /signup` - 회원가입
- `POST /login` - 로그인
- `POST /refresh` - 토큰 갱신
- `GET /me` - 현재 사용자 정보 (인증 필요)
- `POST /logout` - 로그아웃

## 🛠️ 주요 명령어

```bash
pnpm dev              # 프론트+백엔드 동시 실행
pnpm dev:client       # 프론트엔드만 실행
pnpm dev:server       # 백엔드만 실행
pnpm db:studio        # Prisma Studio (DB GUI)
pnpm build            # 빌드
```

## 📄 라이선스

MIT
