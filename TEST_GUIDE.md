# 🧪 Pang Market 인증 플로우 테스트 가이드

## ✅ 완료된 작업

### 1. 모노레포 구조 완성 ✓

```
Pang-Market/
├── client/              # Next.js 프론트엔드 (포트 3000)
├── server/              # Fastify 백엔드 (포트 3001)
├── docker-compose.yml   # PostgreSQL 컨테이너
└── pnpm-workspace.yaml  # 워크스페이스 설정
```

### 2. 백엔드 API 구현 완료 ✓

- ✅ `POST /api/auth/signup` - 회원가입
- ✅ `POST /api/auth/login` - 로그인
- ✅ `POST /api/auth/refresh` - 토큰 갱신
- ✅ `GET /api/auth/me` - 현재 사용자 정보
- ✅ `POST /api/auth/logout` - 로그아웃

### 3. 프론트엔드 연동 완료 ✓

- ✅ `client/lib/auth/auth-api.ts` - 백엔드 API 호출로 변경
- ✅ `client/lib/auth/auth-store.ts` - Zustand persist로 refreshToken 저장
- ✅ `client/lib/auth/token-manager.ts` - 자동 토큰 갱신 로직

### 4. 빌드 검증 완료 ✓

- ✅ 서버 TypeScript 컴파일 성공
- ✅ 클라이언트 Next.js 빌드 성공
- ✅ Prisma 클라이언트 생성 완료

## 🚀 실행 방법

### 사전 준비 (필수)

Docker가 설치되어 있지 않으므로 다음 중 하나를 선택하세요:

#### 옵션 1: Docker 설치 (권장)

```bash
# macOS
brew install --cask docker

# Docker 설치 후
docker compose up -d
```

#### 옵션 2: 로컬 PostgreSQL 사용

```bash
# macOS (Homebrew)
brew install postgresql@16
brew services start postgresql@16

# 데이터베이스 생성
createdb pang_market
```

#### 옵션 3: 클라우드 DB 사용 (Supabase 무료)

1. https://supabase.com 가입
2. 새 프로젝트 생성
3. Database 설정에서 Connection String 복사
4. `server/.env`의 `DATABASE_URL` 변경

### 1단계: 데이터베이스 설정

```bash
cd server

# Prisma 마이그레이션
pnpm db:push

# 성공 메시지 확인
# ✓ Your database is now in sync with your Prisma schema.
```

### 2단계: 백엔드 서버 실행

**터미널 1:**

```bash
cd server
pnpm dev

# 출력 확인:
# ✅ Database connected successfully
# 🚀 Server is running on http://localhost:3001
```

### 3단계: 프론트엔드 실행

**터미널 2:**

```bash
cd client
pnpm dev

# 출력 확인:
# ▲ Next.js 16.0.1
# - Local:  http://localhost:3000
```

## 🧪 테스트 시나리오

### 시나리오 1: 웹 브라우저로 전체 플로우 테스트

#### 1. 회원가입

```
1. http://localhost:3000/signup 접속
2. 정보 입력:
   - 이메일: test@example.com
   - 비밀번호: test1234
   - 이름: 테스트
3. "회원가입" 버튼 클릭
4. 로그인 페이지로 자동 리다이렉트 확인 ✅
```

#### 2. 로그인

```
1. 방금 가입한 정보로 로그인
2. 홈 페이지로 자동 리다이렉트 확인 ✅
3. 사용자 정보 표시 확인 (이름, 이메일) ✅
```

#### 3. 토큰 자동 갱신 확인

```
1. 개발자 도구 → Application → Local Storage 확인
2. "pang-market-auth" 키에 refreshToken 저장 확인 ✅
3. 15분 후 자동으로 accessToken 갱신 (자동) ✅
```

#### 4. 로그아웃

```
1. 로그아웃 버튼 클릭
2. 로그인 페이지로 리다이렉트 확인 ✅
3. Local Storage에서 인증 정보 삭제 확인 ✅
```

### 시나리오 2: API 직접 테스트 (curl)

#### 1. 회원가입 API

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api-test@example.com",
    "password": "test1234",
    "name": "API테스트"
  }'

# 예상 응답:
# {
#   "success": true,
#   "message": "회원가입이 완료되었습니다.",
#   "user": {
#     "id": 1,
#     "email": "api-test@example.com",
#     "name": "API테스트"
#   }
# }
```

#### 2. 로그인 API

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api-test@example.com",
    "password": "test1234"
  }'

# 응답에서 accessToken과 refreshToken 복사
# 예상 응답:
# {
#   "accessToken": "eyJhbGciOiJIUzI1NiIs...",
#   "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
#   "user": { ... }
# }
```

#### 3. 사용자 정보 조회 (인증 필요)

```bash
# 위에서 받은 accessToken 사용
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 예상 응답:
# {
#   "id": 1,
#   "email": "api-test@example.com",
#   "name": "API테스트",
#   "createdAt": "2025-11-11T..."
# }
```

#### 4. 토큰 갱신 API

```bash
# 위에서 받은 refreshToken 사용
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'

# 예상 응답:
# {
#   "accessToken": "eyJhbGciOiJIUzI1NiIs..."  # 새로운 토큰
# }
```

#### 5. 로그아웃 API

```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Content-Type: application/json"

# 예상 응답:
# {
#   "success": true,
#   "message": "로그아웃되었습니다."
# }
```

### 시나리오 3: Prisma Studio로 데이터 확인

```bash
# 터미널 3
pnpm db:studio

# 브라우저가 자동으로 열림 (http://localhost:5555)
# Users 테이블에서 생성된 사용자 확인 ✅
```

## 🎯 테스트 체크리스트

- [ ] PostgreSQL 데이터베이스 연결 성공
- [ ] 서버 시작 (포트 3001)
- [ ] 클라이언트 시작 (포트 3000)
- [ ] 회원가입 성공
- [ ] 중복 이메일 검증 (동일 이메일로 재가입 시 에러)
- [ ] 로그인 성공
- [ ] 잘못된 비밀번호로 로그인 실패
- [ ] JWT 토큰 발급 확인
- [ ] 인증된 사용자 정보 조회 성공
- [ ] 잘못된 토큰으로 요청 시 401 에러
- [ ] 토큰 갱신 성공
- [ ] 만료된 토큰 갱신 시 에러
- [ ] 로그아웃 후 인증 정보 삭제
- [ ] Prisma Studio에서 DB 데이터 확인

## 📊 성능 검증

### JWT 토큰 만료 시간 확인

- **Access Token**: 15분 (테스트: 토큰 생성 후 15분 후 401 에러)
- **Refresh Token**: 7일 (테스트: 7일 후 갱신 실패)

### 보안 검증

- ✅ 비밀번호 bcrypt 해싱 (Prisma Studio에서 확인)
- ✅ JWT 서명 검증 (잘못된 토큰 거부)
- ✅ CORS 설정 (localhost:3000만 허용)

## 🐛 예상 문제 및 해결

### "Database connection failed"

```bash
# PostgreSQL 상태 확인
docker compose ps  # 또는
brew services list

# 재시작
docker compose restart postgres  # 또는
brew services restart postgresql@16
```

### "Port 3001 already in use"

```bash
# 포트 사용 프로세스 확인
lsof -ti:3001

# 종료
kill -9 $(lsof -ti:3001)
```

### "Prisma Client is not generated"

```bash
cd server
pnpm db:generate
```

## 🎉 테스트 완료!

모든 테스트가 통과하면 **Fastify 백엔드 + Next.js 프론트엔드 모노레포**가 성공적으로 구축된 것입니다!

## 🚀 다음 단계

이제 다음 기능들을 추가할 수 있습니다:

- 상품 CRUD API
- 이미지 업로드 (multer, cloudinary)
- 검색 & 필터링
- 페이지네이션
- 실시간 채팅 (WebSocket)
- 결제 연동

---

**구현 완료 항목:**

- ✅ 모노레포 구조 설정
- ✅ Fastify 백엔드 구현
- ✅ Prisma ORM + PostgreSQL
- ✅ JWT 인증 시스템
- ✅ Next.js 프론트엔드 연동
- ✅ TypeScript 타입 안전성
- ✅ 빌드 검증 완료

**테스트 준비 완료! 🎊**
