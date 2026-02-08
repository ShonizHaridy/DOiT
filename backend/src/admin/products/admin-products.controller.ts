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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { Roles } from 'src/auth/decorators/auth.decorators';
import { AdminProductsService } from './admin-products.service';
import { CreateProductDto, AdminProductDto, UpdateProductDto, PaginatedAdminProductsDto } from './dto/admin-products.dto';

@Controller('admin/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminProductsController {
  constructor(private adminProductsService: AdminProductsService) {}

  @Post()
  async createProduct(@Body() dto: CreateProductDto): Promise<AdminProductDto> {
    return this.adminProductsService.createProduct(dto);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<AdminProductDto> {
    return this.adminProductsService.updateProduct(id, dto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return this.adminProductsService.deleteProduct(id);
  }

  @Get()
  async getProducts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
  ): Promise<PaginatedAdminProductsDto> {
    return this.adminProductsService.getProducts(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      search,
      status,
      category,
    );
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.adminProductsService.getProductById(id);
  }
}