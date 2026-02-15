// ============================================
// Controller
// ============================================

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { Roles } from 'src/auth/decorators/auth.decorators';
import { AdminDashboardService } from './admin-dashboard.service';
import {
  DashboardOverviewDto,
  DashboardNotificationsDto,
} from './dto/admin-dashboard.dto';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminDashboardController {
  constructor(private adminDashboardService: AdminDashboardService) {}

  @Get('overview')
  async getOverview(): Promise<DashboardOverviewDto> {
    return this.adminDashboardService.getOverview();
  }

  @Get('recent-activity')
  async getRecentActivity() {
    return this.adminDashboardService.getRecentActivity();
  }

  @Get('notifications')
  async getNotifications(
    @Query('since') since?: string,
  ): Promise<DashboardNotificationsDto> {
    return this.adminDashboardService.getNotifications(since);
  }
}
