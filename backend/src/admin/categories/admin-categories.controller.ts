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
import { AdminCategoriesService } from './admin-categories.service';
import { CreateCategoryDto, UpdateCategoryDto, CreateSubCategoryDto, UpdateSubCategoryDto, CreateProductListDto, UpdateProductListDto } from './dto/admin-categories.dto';

@Controller('admin/categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminCategoriesController {
  constructor(private adminCategoriesService: AdminCategoriesService) {}

  // ============ CATEGORIES ============

  @Get()
  async getCategories() {
    return this.adminCategoriesService.getCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return this.adminCategoriesService.getCategoryById(id);
  }

  @Post()
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.adminCategoriesService.createCategory(dto);
  }

  @Put(':id')
  async updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.adminCategoriesService.updateCategory(id, dto);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string): Promise<void> {
    return this.adminCategoriesService.deleteCategory(id);
  }

  // ============ SUBCATEGORIES ============

  @Post('subcategories')
  async createSubCategory(@Body() dto: CreateSubCategoryDto) {
    return this.adminCategoriesService.createSubCategory(dto);
  }

  @Put('subcategories/:id')
  async updateSubCategory(@Param('id') id: string, @Body() dto: UpdateSubCategoryDto) {
    return this.adminCategoriesService.updateSubCategory(id, dto);
  }

  @Delete('subcategories/:id')
  async deleteSubCategory(@Param('id') id: string): Promise<void> {
    return this.adminCategoriesService.deleteSubCategory(id);
  }

  // ============ PRODUCT LISTS ============

  @Post('product-lists')
  async createProductList(@Body() dto: CreateProductListDto) {
    return this.adminCategoriesService.createProductList(dto);
  }

  @Put('product-lists/:id')
  async updateProductList(@Param('id') id: string, @Body() dto: UpdateProductListDto) {
    return this.adminCategoriesService.updateProductList(id, dto);
  }

  @Delete('product-lists/:id')
  async deleteProductList(@Param('id') id: string): Promise<void> {
    return this.adminCategoriesService.deleteProductList(id);
  }
}