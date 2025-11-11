import { User } from "./auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// 회원가입 API
export async function signup(data: {
  email: string;
  password: string;
  name: string;
}): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "회원가입에 실패했습니다.");
  }

  return {
    success: true,
    message: result.message,
  };
}

// 로그인 API
export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "로그인에 실패했습니다.");
  }

  return {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    user: {
      id: String(result.user.id), // 백엔드는 number, 프론트는 string 사용
      email: result.user.email,
      name: result.user.name,
    },
  };
}

// 토큰 갱신 API
export async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string }> {
  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "토큰 갱신에 실패했습니다.");
  }

  return { accessToken: result.accessToken };
}

// 현재 사용자 정보 API
export async function getCurrentUser(accessToken: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "사용자 정보를 가져오는데 실패했습니다.");
  }

  return {
    id: String(result.id), // 백엔드는 number, 프론트는 string 사용
    email: result.email,
    name: result.name,
  };
}

// 로그아웃 API
export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("로그아웃 요청 실패");
  }
}
