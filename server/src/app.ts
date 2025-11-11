import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { env } from './config/env.js';
import { authRoutes } from './routes/auth.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === 'development' ? 'info' : 'warn',
    },
  });

  // CORS 설정
  await app.register(cors, {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  });

  // JWT 설정
  await app.register(jwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: '15m', // Access token: 15분
    },
  });

  // JWT Refresh Token 설정
  await app.register(jwt, {
    secret: env.JWT_REFRESH_SECRET,
    namespace: 'refresh',
    jwtSign: 'refreshSign',
    jwtVerify: 'refreshVerify',
    sign: {
      expiresIn: '7d', // Refresh token: 7일
    },
  });

  // 헬스 체크
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // 라우트 등록
  await app.register(authRoutes, { prefix: '/api/auth' });

  // 에러 핸들링
  app.setErrorHandler((error: Error & { validation?: unknown; statusCode?: number }, request, reply) => {
    app.log.error(error);

    if (error.validation) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: error.message,
      });
    }

    if (error.statusCode) {
      return reply.status(error.statusCode).send({
        error: error.name,
        message: error.message,
      });
    }

    return reply.status(500).send({
      error: 'Internal Server Error',
      message: env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  });

  return app;
}

