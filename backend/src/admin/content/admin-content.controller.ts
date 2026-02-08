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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { Roles } from 'src/auth/decorators/auth.decorators';
import { AdminContentService } from './admin-content.service';
import { CreateHeroSectionDto, UpdateHeroSectionDto, CreateVendorDto, UpdateVendorDto, CreateBannerDto, UpdateBannerDto, UpdateFeaturedProductsDto } from './dto/admin-content.dto';

@Controller('admin/content')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminContentController {
  constructor(private adminContentService: AdminContentService) {}

  // ============ HERO SECTIONS ============

  @Get('hero-sections')
  async getHeroSections() {
    return this.adminContentService.getHeroSections();
  }

  @Post('hero-sections')
  async createHeroSection(@Body() dto: CreateHeroSectionDto) {
    return this.adminContentService.createHeroSection(dto);
  }

  @Put('hero-sections/:id')
  async updateHeroSection(@Param('id') id: string, @Body() dto: UpdateHeroSectionDto) {
    return this.adminContentService.updateHeroSection(id, dto);
  }

  @Delete('hero-sections/:id')
  async deleteHeroSection(@Param('id') id: string): Promise<void> {
    return this.adminContentService.deleteHeroSection(id);
  }

  // ============ VENDORS ============

  @Get('vendors')
  async getVendors() {
    return this.adminContentService.getVendors();
  }

  @Post('vendors')
  async createVendor(@Body() dto: CreateVendorDto) {
    return this.adminContentService.createVendor(dto);
  }

  @Put('vendors/:id')
  async updateVendor(@Param('id') id: string, @Body() dto: UpdateVendorDto) {
    return this.adminContentService.updateVendor(id, dto);
  }

  @Delete('vendors/:id')
  async deleteVendor(@Param('id') id: string): Promise<void> {
    return this.adminContentService.deleteVendor(id);
  }

  // ============ BANNERS ============

  @Get('banners')
  async getBanners() {
    return this.adminContentService.getBanners();
  }

  @Post('banners')
  async createBanner(@Body() dto: CreateBannerDto) {
    return this.adminContentService.createBanner(dto);
  }

  @Put('banners/:id')
  async updateBanner(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    return this.adminContentService.updateBanner(id, dto);
  }

  @Delete('banners/:id')
  async deleteBanner(@Param('id') id: string): Promise<void> {
    return this.adminContentService.deleteBanner(id);
  }

  // ============ FEATURED PRODUCTS ============

  @Get('featured-products')
  async getFeaturedProductsConfig() {
    return this.adminContentService.getFeaturedProductsConfig();
  }

  @Put('featured-products')
  async updateFeaturedProductsConfig(@Body() dto: UpdateFeaturedProductsDto) {
    return this.adminContentService.updateFeaturedProductsConfig(dto);
  }
}