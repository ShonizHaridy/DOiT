import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/auth.decorators';
import { GetUser } from '../../auth/decorators/auth.decorators';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { AdminUsersService } from './admin-users.service';
import { AdminUserDto, CreateAdminUserDto, UpdateAdminUserDto } from './dto/admin-users.dto';

@Controller('admin/admin-users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  async listAdmins(): Promise<AdminUserDto[]> {
    return this.adminUsersService.listAdmins();
  }

  @Post()
  async createAdmin(@Body() dto: CreateAdminUserDto): Promise<AdminUserDto> {
    return this.adminUsersService.createAdmin(dto);
  }

  @Put(':id')
  async updateAdmin(
    @Param('id') id: string,
    @Body() dto: UpdateAdminUserDto,
    @GetUser('id') actingAdminId: string,
  ): Promise<AdminUserDto> {
    return this.adminUsersService.updateAdmin(id, dto, actingAdminId);
  }

  @Delete(':id')
  async deleteAdmin(@Param('id') id: string, @GetUser('id') actingAdminId: string): Promise<void> {
    return this.adminUsersService.deleteAdmin(id, actingAdminId);
  }
}
