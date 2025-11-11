import { FastifyInstance } from 'fastify';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

export async function authRoutes(app: FastifyInstance) {
  // 회원가입
  app.post('/signup', authController.signup);

  // 로그인
  app.post('/login', authController.login);

  // 토큰 갱신
  app.post('/refresh', authController.refreshToken);

  // 현재 사용자 정보 (보호된 라우트)
  app.get('/me', { onRequest: [authenticate] }, authController.getCurrentUser);

  // 로그아웃
  app.post('/logout', authController.logout);
}

