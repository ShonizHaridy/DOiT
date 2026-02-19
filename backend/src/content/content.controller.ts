// ============================================
// Controller
// ============================================

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from '../auth/decorators/auth.decorators';
import { ContentService } from './content.service';
import { HomeContentDto, InformationPageDto, InformationPageSummaryDto } from './dto/content.dto';
import { ClaimPopupOfferDto } from './dto/popup-offer-claim.dto';

@Controller('content')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Public()
  @Get('home')
  async getHomeContent(): Promise<HomeContentDto> {
    return this.contentService.getHomeContent();
  }

  @Public()
  @Get('popup-offer')
  async getActivePopupOffer() {
    return this.contentService.getActivePopupOffer();
  }

  @Public()
  @Post('popup-offer/claim')
  async claimPopupOffer(@Body() dto: ClaimPopupOfferDto) {
    return this.contentService.claimPopupOffer(dto.email, dto.locale ?? 'en');
  }

  @Public()
  @Get('information-pages')
  async getInformationPages(): Promise<InformationPageSummaryDto[]> {
    return this.contentService.getInformationPages();
  }

  @Public()
  @Get('information-pages/:slug')
  async getInformationPageBySlug(@Param('slug') slug: string): Promise<InformationPageDto> {
    return this.contentService.getInformationPageBySlug(slug);
  }
}

