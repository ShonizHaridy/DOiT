// ============================================
// Controller
// ============================================

import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/auth.decorators';
import { ContentService } from './content.service';
import { HomeContentDto } from './dto/content.dto';

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
}

