import { buildApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';

async function start() {
  try {
    // 데이터베이스 연결
    await connectDatabase();

    // Fastify 앱 빌드
    const app = await buildApp();

    // 서버 시작
    const port = parseInt(env.PORT);
    await app.listen({ port, host: '0.0.0.0' });

    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📊 Health check: http://localhost:${port}/health`);

    // Graceful shutdown
    const signals = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`\n${signal} received, shutting down gracefully...`);
        await app.close();
        await disconnectDatabase();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

