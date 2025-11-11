import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "../config/database.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

// Fastify JWT 확장 타입
declare module "fastify" {
  interface FastifyReply {
    refreshSign: (
      payload: object,
      options?: { expiresIn?: string }
    ) => Promise<string>;
  }
  interface FastifyRequest {
    refreshVerify: <T = { userId: number }>(token: string) => Promise<T>;
  }
}

// Validation Schemas
const signupSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
  name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다."),
});

const loginSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token이 필요합니다."),
});

// Types
type SignupBody = z.infer<typeof signupSchema>;
type LoginBody = z.infer<typeof loginSchema>;
type RefreshBody = z.infer<typeof refreshSchema>;

// 회원가입
export async function signup(
  request: FastifyRequest<{ Body: SignupBody }>,
  reply: FastifyReply
) {
  const validation = signupSchema.safeParse(request.body);

  if (!validation.success) {
    return reply.status(400).send({
      error: "Validation Error",
      message: validation.error.issues[0].message,
    });
  }

  const { email, password, name } = validation.data;

  // 이메일 중복 체크
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return reply.status(400).send({
      error: "Bad Request",
      message: "이미 사용 중인 이메일입니다.",
    });
  }

  // 비밀번호 해싱
  const hashedPassword = await hashPassword(password);

  // 사용자 생성
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  return reply.status(201).send({
    success: true,
    message: "회원가입이 완료되었습니다.",
    user,
  });
}

// 로그인
export async function login(
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
) {
  const validation = loginSchema.safeParse(request.body);

  if (!validation.success) {
    return reply.status(400).send({
      error: "Validation Error",
      message: validation.error.issues[0].message,
    });
  }

  const { email, password } = validation.data;

  // 사용자 찾기
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "이메일 또는 비밀번호가 올바르지 않습니다.",
    });
  }

  // 비밀번호 검증
  const isValidPassword = await verifyPassword(password, user.password);

  if (!isValidPassword) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "이메일 또는 비밀번호가 올바르지 않습니다.",
    });
  }

  // JWT 토큰 생성
  const accessToken = await reply.jwtSign(
    { userId: user.id },
    { expiresIn: "15m" }
  );

  const refreshToken = await reply.refreshSign(
    { userId: user.id },
    { expiresIn: "7d" }
  );

  return reply.send({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
}

// 토큰 갱신
export async function refreshToken(
  request: FastifyRequest<{ Body: RefreshBody }>,
  reply: FastifyReply
) {
  const validation = refreshSchema.safeParse(request.body);

  if (!validation.success) {
    return reply.status(400).send({
      error: "Validation Error",
      message: validation.error.issues[0].message,
    });
  }

  const { refreshToken } = validation.data;

  try {
    // Refresh token 검증
    const decoded = await request.refreshVerify<{ userId: number }>(
      refreshToken
    );

    // 사용자 존재 확인
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return reply.status(401).send({
        error: "Unauthorized",
        message: "인증 정보가 만료되었습니다.",
      });
    }

    // 새로운 Access token 생성
    const newAccessToken = await reply.jwtSign(
      { userId: user.id },
      { expiresIn: "15m" }
    );

    return reply.send({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "인증 정보가 만료되었습니다.",
    });
  }
}

// 현재 사용자 정보 (보호된 라우트)
export async function getCurrentUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  if (!user) {
    return reply.status(404).send({
      error: "Not Found",
      message: "사용자를 찾을 수 없습니다.",
    });
  }

  return reply.send(user);
}

// 로그아웃 (클라이언트 측에서 토큰 삭제로 처리)
export async function logout(request: FastifyRequest, reply: FastifyReply) {
  return reply.send({
    success: true,
    message: "로그아웃되었습니다.",
  });
}
