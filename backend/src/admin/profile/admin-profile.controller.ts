import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/auth.decorators';
import { GetUser } from '../../auth/decorators/auth.decorators';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { AdminProfileService } from './admin-profile.service';
import { AdminProfileDto, UpdateAdminProfileDto } from './dto/admin-profile.dto';

@Controller('admin/profile')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminProfileController {
  constructor(private readonly adminProfileService: AdminProfileService) {}

  @Get()
  async getProfile(@GetUser('id') adminUserId: string): Promise<AdminProfileDto> {
    return this.adminProfileService.getProfile(adminUserId);
  }

  @Put()
  async updateProfile(
    @GetUser('id') adminUserId: string,
    @Body() dto: UpdateAdminProfileDto,
  ): Promise<AdminProfileDto> {
    return this.adminProfileService.updateProfile(adminUserId, dto);
  }
}
