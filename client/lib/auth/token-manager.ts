import { useAuthStore } from "./auth-store";
import { refreshAccessToken } from "./auth-api";

// 토큰 자동 갱신 매니저
class TokenManager {
  private refreshPromise: Promise<string> | null = null;

  // Access Token 가져오기
  getAccessToken(): string | null {
    return useAuthStore.getState().accessToken;
  }

  // Refresh Token 가져오기
  getRefreshToken(): string | null {
    return useAuthStore.getState().refreshToken;
  }

  // Access Token 갱신
  async refreshToken(): Promise<string> {
    // 이미 갱신 중이면 기존 Promise 반환 (중복 요청 방지)
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const refreshToken = this.getRefreshToken();
        
        if (!refreshToken) {
          throw new Error("Refresh token이 없습니다.");
        }

        const { accessToken } = await refreshAccessToken(refreshToken);
        useAuthStore.getState().setAccessToken(accessToken);
        return accessToken;
      } catch (error) {
        // 갱신 실패 시 로그아웃
        useAuthStore.getState().clearAuth();
        throw error;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  // 토큰 자동 갱신이 포함된 Fetch Wrapper
  async fetchWithAuth(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const accessToken = this.getAccessToken();

    if (!accessToken) {
      throw new Error("인증 정보가 없습니다.");
    }

    // Authorization 헤더 추가
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    let response = await fetch(url, { ...options, headers });

    // 401 에러 발생 시 토큰 갱신 후 재시도
    if (response.status === 401) {
      try {
        const newAccessToken = await this.refreshToken();

        // 새 토큰으로 재시도
        const newHeaders = {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        response = await fetch(url, { ...options, headers: newHeaders });
      } catch (error) {
        throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
      }
    }

    return response;
  }
}

export const tokenManager = new TokenManager();
