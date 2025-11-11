# Pang Market

팡 마켓은 JWT 기반 인증 시스템을 갖춘 중고 거래 플랫폼입니다.

## 🚀 기술 스택

### Frontend

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4** - 스타일링
- **shadcn/ui** - UI 컴포넌트

### 상태 관리

- **TanStack Query (React Query)** - 서버 상태 관리
- **Zustand** - 클라이언트 전역 상태 관리

### 폼 & 검증

- **React Hook Form** - 폼 관리
- **Zod** - 스키마 검증

### 인증

- **JWT (JSON Web Token)**
  - Access Token (메모리 저장)
  - Refresh Token (쿠키 저장)

## 📦 주요 기능

- ✅ 회원가입 및 로그인
- ✅ JWT 기반 인증 (Access & Refresh Token)
- ✅ 자동 토큰 갱신
- ✅ 폼 검증 및 에러 처리
- ✅ 반응형 디자인
- ✅ TypeScript로 타입 안정성 보장

## 🏗️ 프로젝트 구조

```
Pang-Market/
├── app/
│   ├── (auth)/
│   │   ├── login/         # 로그인 페이지
│   │   └── signup/        # 회원가입 페이지
│   ├── layout.tsx
│   ├── page.tsx           # 홈 페이지
│   └── providers.tsx      # TanStack Query Provider
├── components/
│   ├── ui/                # shadcn/ui 컴포넌트
│   └── auth/
│       ├── login-form.tsx
│       └── signup-form.tsx
├── lib/
│   ├── auth/
│   │   ├── auth-store.ts      # Zustand 인증 스토어
│   │   ├── auth-api.ts        # Mock API
│   │   ├── auth-hooks.ts      # TanStack Query 훅
│   │   └── token-manager.ts   # JWT 토큰 관리
│   └── validations/
│       └── auth-schema.ts     # Zod 스키마
└── public/
```

## 🛠️ 설치 및 실행

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 3. 빌드

```bash
pnpm build
```

### 4. 프로덕션 실행

```bash
pnpm start
```

## 📝 사용 방법

### 회원가입

1. 홈페이지에서 "회원가입" 버튼 클릭
2. 이메일, 이름, 비밀번호 입력
3. 회원가입 완료 후 자동으로 로그인 페이지로 이동

### 로그인

1. 이메일과 비밀번호 입력
2. 로그인 성공 시 홈페이지로 이동
3. 사용자 정보 확인 가능

### 로그아웃

1. 홈페이지에서 "로그아웃" 버튼 클릭
2. 인증 정보가 초기화되고 로그인 페이지로 이동

## 🔐 인증 시스템

### JWT 토큰 관리

- **Access Token**: 메모리(Zustand)에 저장, 15분 유효
- **Refresh Token**: LocalStorage에 저장, 7일 유효
  - _주의: 실제 프로덕션에서는 httpOnly 쿠키 사용 권장_

### 보안 특징

- Access Token은 메모리에만 저장하여 XSS 공격 방지
- 토큰 만료 시 자동 갱신
- 인증 실패 시 자동 로그아웃

## 🧪 Mock API

현재는 LocalStorage를 DB처럼 사용하는 Mock API로 구현되어 있습니다.

실제 백엔드 연결 시 `lib/auth/auth-api.ts` 파일의 함수들을 실제 API 호출로 교체하면 됩니다.

## 📚 주요 라이브러리 문서

- [Next.js 문서](https://nextjs.org/docs)
- [TanStack Query 문서](https://tanstack.com/query/latest)
- [Zustand 문서](https://zustand-demo.pmnd.rs/)
- [React Hook Form 문서](https://react-hook-form.com/)
- [Zod 문서](https://zod.dev/)
- [shadcn/ui 문서](https://ui.shadcn.com/)

## 🚧 향후 계획

- [ ] 테스트 코드 작성 (Jest + React Testing Library)
- [ ] 실제 백엔드 API 연동
- [ ] Protected Route 미들웨어
- [ ] 상품 등록/조회 기능
- [ ] 채팅 기능
- [ ] 이미지 업로드

## 📄 라이선스

MIT License

## 👥 기여

이슈나 PR은 언제든 환영합니다!
