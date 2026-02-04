import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 1. Create the database connection pool
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // 2. Create the Prisma adapter
    const adapter = new PrismaPg(pool);

    // 3. Pass the adapter to the super constructor
    super({ adapter });
  }

  async onModuleInit() {
    // In Prisma 7, $connect is often handled via the adapter, 
    // but keeping it here for NestJS lifecycle clarity is fine.
    await this.$connect();
    console.log('✅ Database connected (Prisma 7)');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('❌ Database disconnected');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    // Use Prisma.ModelName if you need to iterate, or keep your Reflect logic
    const models = Reflect.ownKeys(this).filter(
      (key) => typeof key === 'string' && key[0] !== '_' && key[0] !== '$',
    );

    return Promise.all(
      models.map((modelKey) => (this as any)[modelKey].deleteMany()),
    );
  }
}