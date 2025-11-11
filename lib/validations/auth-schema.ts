import { z } from "zod";

// 로그인 스키마
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요.")
    .min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
});

export type LoginInput = z.infer<typeof loginSchema>;

// 회원가입 스키마
export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .email("올바른 이메일 형식이 아닙니다."),
    name: z
      .string()
      .min(1, "이름을 입력해주세요.")
      .min(2, "이름은 최소 2자 이상이어야 합니다.")
      .max(20, "이름은 최대 20자까지 가능합니다."),
    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요.")
      .min(6, "비밀번호는 최소 6자 이상이어야 합니다.")
      .max(50, "비밀번호는 최대 50자까지 가능합니다.")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        "비밀번호는 영문과 숫자를 포함해야 합니다."
      ),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export type SignupInput = z.infer<typeof signupSchema>;
