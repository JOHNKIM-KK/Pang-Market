import { FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    userId: number;
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const decoded = await request.jwtVerify<{ userId: number }>();
    request.userId = decoded.userId;
  } catch (error) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: '인증이 필요합니다.',
    });
  }
}

