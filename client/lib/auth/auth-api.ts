import axios from "axios";
import { apiClient } from "../api-client";
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
  try {
    // 회원가입은 인증이 필요 없으므로 apiClient 대신 axios 직접 사용
    const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "회원가입에 실패했습니다."
      );
    }
    throw new Error("회원가입에 실패했습니다.");
  }
}

// 로그인 API
export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    // 로그인도 인증이 필요 없으므로 axios 직접 사용
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      user: {
        id: String(response.data.user.id), // 백엔드는 number, 프론트는 string 사용
        email: response.data.user.email,
        name: response.data.user.name,
      },
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "로그인에 실패했습니다.");
    }
    throw new Error("로그인에 실패했습니다.");
  }
}

// 토큰 갱신 API
export async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string }> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/refresh`,
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return { accessToken: response.data.accessToken };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "토큰 갱신에 실패했습니다."
      );
    }
    throw new Error("토큰 갱신에 실패했습니다.");
  }
}

// 현재 사용자 정보 API
export async function getCurrentUser(): Promise<User> {
  try {
    // 인증이 필요한 API는 apiClient 사용 (자동으로 토큰 추가됨)
    const response = await apiClient.get("/api/auth/me");

    return {
      id: String(response.data.id), // 백엔드는 number, 프론트는 string 사용
      email: response.data.email,
      name: response.data.name,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "사용자 정보를 가져오는데 실패했습니다."
      );
    }
    throw new Error("사용자 정보를 가져오는데 실패했습니다.");
  }
}

// 로그아웃 API
export async function logout(): Promise<void> {
  try {
    // 로그아웃은 인증이 필요할 수 있으므로 apiClient 사용
    await apiClient.post("/api/auth/logout");
  } catch (error) {
    // 로그아웃 실패해도 클라이언트에서는 처리
    console.error("로그아웃 요청 실패:", error);
  }
}
