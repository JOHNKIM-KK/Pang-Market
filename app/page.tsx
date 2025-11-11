"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/auth/auth-store";
import { useLogout } from "@/lib/auth/auth-hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();
  const logoutMutation = useLogout();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            팡 마켓에 오신 것을 환영합니다!
          </CardTitle>
          <CardDescription className="text-lg">
            중고 거래의 새로운 경험
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isAuthenticated && user ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <p className="text-lg font-medium text-green-900">
                  안녕하세요, {user.name}님!
                </p>
                <p className="text-sm text-green-700">{user.email}</p>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => logoutMutation.mutate()}
                  variant="outline"
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-gray-600">
                로그인하여 팡 마켓의 다양한 서비스를 이용해보세요
              </p>

              <div className="flex justify-center gap-4">
                <Link href="/login">
                  <Button>로그인</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline">회원가입</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
