// ============================================
// Controller
// ============================================

import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { GetUser, Roles } from 'src/auth/decorators/auth.decorators';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { WishlistItemDto, AddToWishlistDto } from './dto/wishlist.dto';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('customer')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  async getWishlist(@GetUser('id') customerId: string): Promise<WishlistItemDto[]> {
    return this.wishlistService.getWishlist(customerId);
  }

  @Post()
  async addToWishlist(
    @GetUser('id') customerId: string,
    @Body() dto: AddToWishlistDto,
  ): Promise<WishlistItemDto> {
    return this.wishlistService.addToWishlist(customerId, dto);
  }

  @Delete(':productId')
  async removeFromWishlist(
    @GetUser('id') customerId: string,
    @Param('productId') productId: string,
  ): Promise<void> {
    return this.wishlistService.removeFromWishlist(customerId, productId);
  }

  @Delete()
  async clearWishlist(@GetUser('id') customerId: string): Promise<void> {
    return this.wishlistService.clearWishlist(customerId);
  }
}

