import { randomUUID } from 'crypto'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AdminShippingRateDto,
  BulkUpsertShippingRatesDto,
  CreateShippingRateDto,
  UpdateShippingRateDto,
} from './dto/admin-shipping.dto';
import { EGYPT_GOVERNORATES } from 'src/common/constants/governorates.constant';

type ShippingRateRow = {
  id: string
  governorate: string
  price: unknown
  status: boolean
  createdAt: Date
  updatedAt: Date
}

@Injectable()
export class AdminShippingService {
  constructor(private prisma: PrismaService) {}

  private readonly governorateMap = new Map(
    EGYPT_GOVERNORATES.map((governorate) => [governorate.toLowerCase(), governorate]),
  );

  private toNumber(value: unknown): number {
    if (value && typeof value === 'object' && 'toNumber' in (value as any)) {
      return (value as any).toNumber()
    }
    const parsed = Number(value ?? 0)
    return Number.isFinite(parsed) ? parsed : 0
  }

  private toDto(rate: ShippingRateRow): AdminShippingRateDto {
    return {
      id: rate.id,
      governorate: rate.governorate,
      price: this.toNumber(rate.price),
      status: Boolean(rate.status),
      createdAt: rate.createdAt,
      updatedAt: rate.updatedAt,
    };
  }

  private normalizeGovernorateOrThrow(value?: string): string {
    const raw = value?.trim();
    if (!raw) {
      throw new BadRequestException('Governorate is required');
    }

    const normalized = this.governorateMap.get(raw.toLowerCase());
    if (!normalized) {
      throw new BadRequestException(`Unsupported governorate: ${raw}`);
    }

    return normalized;
  }

  async getShippingRates(): Promise<AdminShippingRateDto[]> {
    const rates = await this.prisma.$queryRaw<ShippingRateRow[]>`
      SELECT id, governorate, price, status, "createdAt", "updatedAt"
      FROM shipping_rates
      ORDER BY governorate ASC
    `
    return rates.map((rate) => this.toDto(rate));
  }

  async createShippingRate(dto: CreateShippingRateDto): Promise<AdminShippingRateDto> {
    const governorate = this.normalizeGovernorateOrThrow(dto.governorate);

    const existing = await this.prisma.$queryRaw<ShippingRateRow[]>`
      SELECT id, governorate, price, status, "createdAt", "updatedAt"
      FROM shipping_rates
      WHERE LOWER(governorate) = LOWER(${governorate})
      LIMIT 1
    `
    if (existing.length > 0) {
      throw new BadRequestException('Shipping rate for this governorate already exists');
    }

    const id = randomUUID()
    const inserted = await this.prisma.$queryRaw<ShippingRateRow[]>`
      INSERT INTO shipping_rates (id, governorate, price, status, "createdAt", "updatedAt")
      VALUES (${id}, ${governorate}, ${dto.price}, ${dto.status ?? true}, NOW(), NOW())
      RETURNING id, governorate, price, status, "createdAt", "updatedAt"
    `
    return this.toDto(inserted[0]);
  }

  async updateShippingRate(
    id: string,
    dto: UpdateShippingRateDto,
  ): Promise<AdminShippingRateDto> {
    const existingRows = await this.prisma.$queryRaw<ShippingRateRow[]>`
      SELECT id, governorate, price, status, "createdAt", "updatedAt"
      FROM shipping_rates
      WHERE id = ${id}
      LIMIT 1
    `
    const existing = existingRows[0]
    if (!existing) {
      throw new NotFoundException('Shipping rate not found');
    }

    const governorate = dto.governorate
      ? this.normalizeGovernorateOrThrow(dto.governorate)
      : existing.governorate;

    const duplicate = await this.prisma.$queryRaw<ShippingRateRow[]>`
      SELECT id, governorate, price, status, "createdAt", "updatedAt"
      FROM shipping_rates
      WHERE id <> ${id}
        AND LOWER(governorate) = LOWER(${governorate})
      LIMIT 1
    `
    if (duplicate.length > 0) {
      throw new BadRequestException('Shipping rate for this governorate already exists');
    }

    const price = dto.price ?? this.toNumber(existing.price)
    const status = dto.status ?? existing.status

    const updated = await this.prisma.$queryRaw<ShippingRateRow[]>`
      UPDATE shipping_rates
      SET governorate = ${governorate},
          price = ${price},
          status = ${status},
          "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING id, governorate, price, status, "createdAt", "updatedAt"
    `
    return this.toDto(updated[0]);
  }

  async upsertShippingRates(
    dto: BulkUpsertShippingRatesDto,
  ): Promise<AdminShippingRateDto[]> {
    const uniqueGovernorates = Array.from(
      new Set(dto.governorates.map((item) => this.normalizeGovernorateOrThrow(item))),
    );
    if (uniqueGovernorates.length === 0) {
      throw new BadRequestException('At least one governorate is required');
    }

    const rows: ShippingRateRow[] = [];
    for (const governorate of uniqueGovernorates) {
      const id = randomUUID();
      const result = await this.prisma.$queryRaw<ShippingRateRow[]>`
        INSERT INTO shipping_rates (id, governorate, price, status, "createdAt", "updatedAt")
        VALUES (${id}, ${governorate}, ${dto.price}, ${dto.status ?? true}, NOW(), NOW())
        ON CONFLICT (governorate) DO UPDATE
          SET price = EXCLUDED.price,
              status = EXCLUDED.status,
              "updatedAt" = NOW()
        RETURNING id, governorate, price, status, "createdAt", "updatedAt"
      `;
      rows.push(result[0]);
    }

    return rows
      .map((row) => this.toDto(row))
      .sort((a, b) => a.governorate.localeCompare(b.governorate));
  }

  async deleteShippingRate(id: string): Promise<void> {
    const existingRows = await this.prisma.$queryRaw<ShippingRateRow[]>`
      SELECT id, governorate, price, status, "createdAt", "updatedAt"
      FROM shipping_rates
      WHERE id = ${id}
      LIMIT 1
    `
    if (!existingRows[0]) {
      throw new NotFoundException('Shipping rate not found');
    }

    await this.prisma.$executeRaw`
      DELETE FROM shipping_rates
      WHERE id = ${id}
    `
  }
}
