// ============================================
// Controller
// ============================================

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Header,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { Roles } from 'src/auth/decorators/auth.decorators';
import { AdminOffersService } from './admin-offers.service';
import { CreateOfferDto, UpdateOfferDto, CreatePopupOfferDto, UpdatePopupOfferDto } from './dto/admin-offers.dto';

@Controller('admin/offers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminOffersController {
  constructor(private adminOffersService: AdminOffersService) {}

  // ============ OFFERS ============

  @Get()
  async getOffers(@Query('status') status?: string) {
    return this.adminOffersService.getOffers(status);
  }

  @Get('export')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="offers-export.csv"')
  async exportOffers(
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ): Promise<string> {
    return this.adminOffersService.exportOffersCsv(search, type, status);
  }

  @Get(':id')
  async getOfferById(@Param('id') id: string) {
    return this.adminOffersService.getOfferById(id);
  }

  @Post()
  async createOffer(@Body() dto: CreateOfferDto) {
    return this.adminOffersService.createOffer(dto);
  }

  @Put(':id')
  async updateOffer(@Param('id') id: string, @Body() dto: UpdateOfferDto) {
    return this.adminOffersService.updateOffer(id, dto);
  }

  @Delete(':id')
  async deleteOffer(@Param('id') id: string): Promise<void> {
    return this.adminOffersService.deleteOffer(id);
  }

  // ============ POPUP OFFERS ============

  @Get('popup/all')
  async getPopupOffers() {
    return this.adminOffersService.getPopupOffers();
  }

  @Post('popup')
  async createPopupOffer(@Body() dto: CreatePopupOfferDto) {
    return this.adminOffersService.createPopupOffer(dto);
  }

  @Put('popup/:id')
  async updatePopupOffer(@Param('id') id: string, @Body() dto: UpdatePopupOfferDto) {
    return this.adminOffersService.updatePopupOffer(id, dto);
  }

  @Delete('popup/:id')
  async deletePopupOffer(@Param('id') id: string): Promise<void> {
    return this.adminOffersService.deletePopupOffer(id);
  }
}
