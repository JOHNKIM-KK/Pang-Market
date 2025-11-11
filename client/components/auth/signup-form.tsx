"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signupSchema, type SignupInput } from "@/lib/validations/auth-schema";
import { useSignup } from "@/lib/auth/auth-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const signupMutation = useSignup();

  const onSubmit = async (data: SignupInput) => {
    try {
      await signupMutation.mutateAsync({
        email: data.email,
        password: data.password,
        name: data.name,
      });
    } catch (error) {
      // 에러는 mutation에서 처리
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">회원가입</CardTitle>
        <CardDescription>새 계정을 만들어 팡 마켓을 시작하세요</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {signupMutation.isError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
              {signupMutation.error instanceof Error
                ? signupMutation.error.message
                : "회원가입에 실패했습니다."}
            </div>
          )}

          {signupMutation.isSuccess && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
              회원가입이 완료되었습니다! 로그인 페이지로 이동합니다...
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              {...register("email")}
              disabled={isSubmitting || signupMutation.isPending}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              type="text"
              placeholder="홍길동"
              {...register("name")}
              disabled={isSubmitting || signupMutation.isPending}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              disabled={isSubmitting || signupMutation.isPending}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
            <Input
              id="passwordConfirm"
              type="password"
              placeholder="••••••••"
              {...register("passwordConfirm")}
              disabled={isSubmitting || signupMutation.isPending}
            />
            {errors.passwordConfirm && (
              <p className="text-sm text-red-600">
                {errors.passwordConfirm.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 mt-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || signupMutation.isPending}
          >
            {signupMutation.isPending ? "가입 중..." : "회원가입"}
          </Button>

          <p className="text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              로그인
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
