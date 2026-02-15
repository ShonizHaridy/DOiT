import { Module } from '@nestjs/common';

// Import all admin controllers
import { AdminProductsController } from './products/admin-products.controller';
import { AdminCategoriesController } from './categories/admin-categories.controller';
import { AdminOrdersController } from './orders/admin-orders.controller';
import { AdminCustomersController } from './customers/admin-customers.controller';
import { AdminContentController } from './content/admin-content.controller';
import { AdminOffersController } from './offers/admin-offers.controller';
import { AdminDashboardController } from './dashboard/admin-dashboard.controller';
import { AdminProfileController } from './profile/admin-profile.controller';

// Import all admin services
import { AdminProductsService } from './products/admin-products.service';
import { AdminCategoriesService } from './categories/admin-categories.service';
import { AdminOrdersService } from './orders/admin-orders.service';
import { AdminCustomersService } from './customers/admin-customers.service';
import { AdminContentService } from './content/admin-content.service';
import { AdminOffersService } from './offers/admin-offers.service';
import { AdminDashboardService } from './dashboard/admin-dashboard.service';
import { AdminProfileService } from './profile/admin-profile.service';

@Module({
  controllers: [
    AdminProductsController,
    AdminCategoriesController,
    AdminOrdersController,
    AdminCustomersController,
    AdminContentController,
    AdminOffersController,
    AdminDashboardController,
    AdminProfileController,
  ],
  providers: [
    AdminProductsService,
    AdminCategoriesService,
    AdminOrdersService,
    AdminCustomersService,
    AdminContentService,
    AdminOffersService,
    AdminDashboardService,
    AdminProfileService,
  ],
  exports: [
    AdminProductsService,
    AdminCategoriesService,
    AdminOrdersService,
    AdminCustomersService,
    AdminContentService,
    AdminOffersService,
    AdminDashboardService,
    AdminProfileService,
  ],
})
export class AdminModule {}
