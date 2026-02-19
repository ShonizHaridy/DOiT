import {
  ArrayNotEmpty,
  IsBoolean,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OptionalField, ToNumber } from 'src/common/decorators/transform.decorator';

export class CreateShippingRateDto {
  @IsString()
  governorate: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class UpdateShippingRateDto {
  @IsOptional()
  @IsString()
  governorate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class BulkUpsertShippingRatesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  governorates: string[];

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class AdminShippingRateDto {
  id: string;
  governorate: string;

  @ToNumber()
  price: number;

  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
