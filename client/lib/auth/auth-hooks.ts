import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./auth-store";
import { login, signup, logout, getCurrentUser } from "./auth-api";
import type { LoginInput } from "../validations/auth-schema";

// 로그인 훅
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await login(data);
      return response;
    },
    onSuccess: (data) => {
      // Zustand 스토어에 인증 정보 저장 (refreshToken 포함)
      setAuth(data.accessToken, data.refreshToken, data.user);

      // 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      // 홈으로 이동
      router.push("/");
    },
  });
}

// 회원가입 훅
export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name: string;
    }) => {
      const response = await signup(data);
      return response;
    },
    onSuccess: () => {
      // 회원가입 성공 시 로그인 페이지로 이동
      router.push("/login");
    },
  });
}

// 로그아웃 훅
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      // Zustand 스토어 초기화
      clearAuth();

      // 모든 쿼리 캐시 초기화
      queryClient.clear();

      // 로그인 페이지로 이동
      router.push("/login");
    },
  });
}

// 현재 사용자 정보 조회 훅
export function useCurrentUser() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("인증 정보가 없습니다.");
      }
      const user = await getCurrentUser(accessToken);
      return user;
    },
    enabled: !!accessToken, // accessToken이 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1,
  });
}
