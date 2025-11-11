# 🚀 Pang Market 설정 가이드

모노레포 설정 후 첫 실행을 위한 단계별 가이드입니다.

## 📋 사전 요구사항

- Node.js 20+ 설치
- pnpm 설치 (`npm install -g pnpm`)
- Docker 설치 (PostgreSQL용)

## 🔧 설정 단계

### 1단계: 의존성 설치

```bash
# 루트 디렉토리에서 실행
pnpm install
```

이 명령어는 자동으로 `client/`와 `server/` 두 패키지의 의존성을 모두 설치합니다.

### 2단계: PostgreSQL 데이터베이스 시작

```bash
# Docker Compose로 PostgreSQL 시작
docker-compose up -d

# 데이터베이스 실행 확인
docker-compose ps
```

출력 예시:
```
NAME                  STATUS              PORTS
pang-market-db        Up 10 seconds       0.0.0.0:5432->5432/tcp
```

### 3단계: 환경 변수 설정

#### 서버 환경 변수

`server/.env` 파일이 이미 생성되어 있습니다. 내용 확인:

```bash
cat server/.env
```

기본값:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/pang_market"
JWT_SECRET="dev-secret-key-12345678901234567890"
JWT_REFRESH_SECRET="dev-refresh-secret-key-12345678901234567890"
PORT=3001
NODE_ENV=development
```

#### 클라이언트 환경 변수 (선택사항)

`client/.env.local` 파일을 생성하여 API URL을 커스터마이징할 수 있습니다:

```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > client/.env.local
```

> 참고: 생략 시 기본값으로 `http://localhost:3001`이 사용됩니다.

### 4단계: Prisma 마이그레이션

```bash
cd server

# Prisma 클라이언트 생성
pnpm db:generate

# 데이터베이스 스키마 푸시
pnpm db:push
```

성공 메시지:
```
Your database is now in sync with your Prisma schema.
```

### 5단계: 서버 실행

새 터미널 창에서:

```bash
cd server
pnpm dev
```

출력:
```
✅ Database connected successfully
🚀 Server is running on http://localhost:3001
📊 Health check: http://localhost:3001/health
```

### 6단계: 클라이언트 실행

또 다른 터미널 창에서:

```bash
cd client
pnpm dev
```

출력:
```
▲ Next.js 16.0.1
- Local:        http://localhost:3000
- Ready in 2.3s
```

### 7단계: 헬스 체크

브라우저나 curl로 확인:

```bash
# 백엔드 헬스 체크
curl http://localhost:3001/health

# 프론트엔드 접속
open http://localhost:3000
```

## ✅ 동작 확인

### 1. 회원가입 테스트

1. 브라우저에서 `http://localhost:3000/signup` 접속
2. 이메일, 비밀번호, 이름 입력
3. "회원가입" 버튼 클릭
4. 로그인 페이지로 자동 이동

### 2. 로그인 테스트

1. 회원가입한 정보로 로그인
2. 홈 페이지로 자동 이동
3. 사용자 정보 표시 확인

### 3. API 직접 테스트 (curl)

#### 회원가입
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test1234",
    "name": "테스트"
  }'
```

#### 로그인
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test1234"
  }'
```

응답 예시:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "1",
    "email": "test@example.com",
    "name": "테스트"
  }
}
```

#### 인증된 요청 (사용자 정보)
```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🛠️ 유틸리티 명령어

### 루트에서 실행 가능한 명령어

```bash
# 프론트엔드 + 백엔드 동시 실행
pnpm dev

# 프론트엔드만 실행
pnpm dev:client

# 백엔드만 실행
pnpm dev:server

# Prisma Studio (DB GUI)
pnpm db:studio

# 프로젝트 빌드
pnpm build
```

### 개발 도구

#### Prisma Studio로 데이터 확인

```bash
pnpm db:studio
```

브라우저가 자동으로 열리며 `http://localhost:5555`에서 데이터를 확인할 수 있습니다.

#### 데이터베이스 로그 확인

```bash
docker-compose logs -f postgres
```

## 🐛 트러블슈팅

### "포트가 이미 사용 중입니다" 에러

```bash
# 포트 사용 중인 프로세스 확인
lsof -ti:3000  # Next.js
lsof -ti:3001  # Fastify
lsof -ti:5432  # PostgreSQL

# 프로세스 종료 (PID 확인 후)
kill -9 <PID>
```

### 데이터베이스 연결 실패

```bash
# PostgreSQL 컨테이너 상태 확인
docker-compose ps

# 컨테이너 재시작
docker-compose restart postgres

# 로그 확인
docker-compose logs postgres
```

### Prisma 클라이언트 에러

```bash
cd server
pnpm db:generate
```

### 의존성 문제

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules client/node_modules server/node_modules
rm pnpm-lock.yaml
pnpm install
```

### 모든 것을 리셋하고 싶을 때

```bash
# 데이터베이스 완전 삭제 (데이터 포함)
docker-compose down -v

# node_modules 삭제
rm -rf node_modules client/node_modules server/node_modules

# 처음부터 다시 시작
pnpm install
docker-compose up -d
cd server && pnpm db:push
```

## 📚 다음 단계

축하합니다! 🎉 모노레포 설정이 완료되었습니다.

이제 다음 기능들을 추가할 수 있습니다:
- 상품 CRUD API
- 파일 업로드
- 검색 기능
- 페이지네이션
- 실시간 채팅

궁금한 점이 있으면 README.md를 참고하세요!

