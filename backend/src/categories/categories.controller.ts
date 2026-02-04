// ============================================
// Controller
// ============================================

import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from '../auth/decorators/auth.decorators';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Public()
  @Get()
  async getCategories(@Query('includeChildren') includeChildren?: string): Promise<CategoryDto[]> {
    return this.categoriesService.getCategories(includeChildren === 'true');
  }

  @Public()
  @Get('filters')
  async getFilterOptions() {
    return this.categoriesService.getFilterOptions();
  }

  @Public()
  @Get(':id')
  async getCategoryById(@Param('id') id: string): Promise<CategoryDto> {
    return this.categoriesService.getCategoryById(id);
  }
}