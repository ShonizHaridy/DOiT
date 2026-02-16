import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs'; // ← ADD THIS
import { join } from 'path';
import fastifyStatic from '@fastify/static';
import fastifyMultipart from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // ✅ Register Fastify Multipart (for file uploads)
  await app.register(fastifyMultipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB max file size
      files: 10, // Max 10 files per request
    },
  });


  // ✅ Serve uploaded files as static content
  await app.register(fastifyStatic, {
    root: join(process.cwd(), 'uploads'),
    prefix: '/uploads/',
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.setGlobalPrefix('api');

  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://doitegypt.com',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ========================================
  // 🆕 GENERATE OPENAPI SPEC (NO UI)
  // ========================================
  const config = new DocumentBuilder()
    .setTitle('DOiT E-commerce API')
    .setDescription('Auto-generated API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // ✅ Save to file (for Postman import)
  fs.writeFileSync('./openapi.json', JSON.stringify(document, null, 2));

  // ❌ NO Swagger UI mounted (no /api route)
  // SwaggerModule.setup('api', app, document); // ← SKIP THIS

  const port = 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 NestJS Backend running on: http://localhost:${port}/api`);
  console.log(`📄 OpenAPI spec saved to: ./openapi.json`);
}

bootstrap();
