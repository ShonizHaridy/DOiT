import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/auth.decorators';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { AdminShippingService } from './admin-shipping.service';
import {
  AdminShippingRateDto,
  BulkUpsertShippingRatesDto,
  CreateShippingRateDto,
  UpdateShippingRateDto,
} from './dto/admin-shipping.dto';

@Controller('admin/shipping-rates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminShippingController {
  constructor(private adminShippingService: AdminShippingService) {}

  @Get()
  async getShippingRates(): Promise<AdminShippingRateDto[]> {
    return this.adminShippingService.getShippingRates();
  }

  @Post()
  async createShippingRate(@Body() dto: CreateShippingRateDto): Promise<AdminShippingRateDto> {
    return this.adminShippingService.createShippingRate(dto);
  }

  @Post('bulk')
  async upsertShippingRates(
    @Body() dto: BulkUpsertShippingRatesDto,
  ): Promise<AdminShippingRateDto[]> {
    return this.adminShippingService.upsertShippingRates(dto);
  }

  @Put(':id')
  async updateShippingRate(
    @Param('id') id: string,
    @Body() dto: UpdateShippingRateDto,
  ): Promise<AdminShippingRateDto> {
    return this.adminShippingService.updateShippingRate(id, dto);
  }

  @Delete(':id')
  async deleteShippingRate(@Param('id') id: string): Promise<void> {
    return this.adminShippingService.deleteShippingRate(id);
  }
}
