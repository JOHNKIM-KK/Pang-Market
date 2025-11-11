import { User } from "./auth-store";

// Mock 사용자 데이터베이스 (localStorage 사용)
const USERS_KEY = "pang_market_users";
const REFRESH_TOKEN_KEY = "pang_market_refresh_token";

interface StoredUser {
  id: string;
  email: string;
  name: string;
  password: string; // 실제로는 해시화해야 하지만, Mock이므로 평문 저장
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// 로컬 스토리지에서 사용자 목록 가져오기
function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

// 로컬 스토리지에 사용자 목록 저장
function saveUsers(users: StoredUser[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// JWT Mock 생성 (실제로는 서버에서 생성)
function generateToken(userId: string, type: "access" | "refresh"): string {
  const payload = {
    userId,
    type,
    exp:
      type === "access"
        ? Date.now() + 15 * 60 * 1000 // 15분
        : Date.now() + 7 * 24 * 60 * 60 * 1000, // 7일
  };
  // Mock JWT (실제로는 암호화 필요)
  return btoa(JSON.stringify(payload));
}

// JWT Mock 검증
function verifyToken(
  token: string
): { userId: string; type: string; exp: number } | null {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) {
      return null; // 토큰 만료
    }
    return payload;
  } catch {
    return null;
  }
}

// 회원가입 API
export async function signup(data: {
  email: string;
  password: string;
  name: string;
}): Promise<{ success: boolean; message: string }> {
  // 시뮬레이션 딜레이
  await new Promise((resolve) => setTimeout(resolve, 800));

  const users = getUsers();

  // 이메일 중복 체크
  if (users.some((u) => u.email === data.email)) {
    throw new Error("이미 사용 중인 이메일입니다.");
  }

  // 새 사용자 생성
  const newUser: StoredUser = {
    id: `user_${Date.now()}`,
    email: data.email,
    name: data.name,
    password: data.password,
  };

  users.push(newUser);
  saveUsers(users);

  return {
    success: true,
    message: "회원가입이 완료되었습니다.",
  };
}

// 로그인 API
export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  // 시뮬레이션 딜레이
  await new Promise((resolve) => setTimeout(resolve, 800));

  const users = getUsers();
  const user = users.find(
    (u) => u.email === data.email && u.password === data.password
  );

  if (!user) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  const accessToken = generateToken(user.id, "access");
  const refreshToken = generateToken(user.id, "refresh");

  // refreshToken을 쿠키에 저장 (js-cookie 사용)
  if (typeof window !== "undefined") {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}

// 토큰 갱신 API
export async function refreshAccessToken(): Promise<{ accessToken: string }> {
  // 시뮬레이션 딜레이
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (typeof window === "undefined") {
    throw new Error("인증 정보를 찾을 수 없습니다.");
  }

  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    throw new Error("인증 정보를 찾을 수 없습니다.");
  }

  const payload = verifyToken(refreshToken);

  if (!payload || payload.type !== "refresh") {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    throw new Error("인증 정보가 만료되었습니다.");
  }

  const accessToken = generateToken(payload.userId, "access");

  return { accessToken };
}

// 현재 사용자 정보 API
export async function getCurrentUser(accessToken: string): Promise<User> {
  // 시뮬레이션 딜레이
  await new Promise((resolve) => setTimeout(resolve, 300));

  const payload = verifyToken(accessToken);

  if (!payload || payload.type !== "access") {
    throw new Error("유효하지 않은 인증 정보입니다.");
  }

  const users = getUsers();
  const user = users.find((u) => u.id === payload.userId);

  if (!user) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

// 로그아웃 API
export async function logout(): Promise<void> {
  // 시뮬레이션 딜레이
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (typeof window !== "undefined") {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
