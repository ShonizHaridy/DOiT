import { Controller, Get, Query, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetProductsQueryDto, ProductResponseDto, PaginatedProductsDto } from './dto/product.dto';
import { Public } from '../auth/decorators/auth.decorators';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public()
  @Get()
  async getProducts(@Query() query: GetProductsQueryDto): Promise<PaginatedProductsDto> {
    return this.productsService.getProducts(query);
  }

  @Public()
  @Get('featured')
  async getFeaturedProducts(): Promise<ProductResponseDto[]> {
    return this.productsService.getFeaturedProducts();
  }

  @Public()
  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productsService.getProductById(id);
  }
}