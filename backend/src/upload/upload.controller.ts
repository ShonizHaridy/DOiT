import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Roles } from '../auth/decorators/auth.decorators';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { UploadService, UploadFolder } from './upload.service';

interface FileData {
  buffer: Buffer;
  filename: string;
  mimetype: string;
}

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin') // Only admins can upload
export class UploadController {
  constructor(private uploadService: UploadService) {}

  /**
   * Upload single product image
   */
  @Post('product-image')
  async uploadProductImage(@Req() req: FastifyRequest): Promise<{ url: string }> {
    const file = await this.extractSingleFile(req);
    const url = await this.uploadService.uploadImage(
      file.buffer,
      file.filename,
      file.mimetype,
      'products',
    );
    return { url };
  }

  /**
   * Upload multiple product images
   */
  @Post('product-images')
  async uploadProductImages(@Req() req: FastifyRequest): Promise<{ urls: string[] }> {
    const files = await this.extractMultipleFiles(req);
    const urls = await this.uploadService.uploadMultipleImages(files, 'products');
    return { urls };
  }

  /**
   * Upload hero section image
   */
  @Post('hero-image')
  async uploadHeroImage(@Req() req: FastifyRequest): Promise<{ url: string }> {
    const file = await this.extractSingleFile(req);
    const url = await this.uploadService.uploadImage(
      file.buffer,
      file.filename,
      file.mimetype,
      'heroes',
    );
    return { url };
  }

  /**
   * Upload banner image
   */
  @Post('banner-image')
  async uploadBannerImage(@Req() req: FastifyRequest): Promise<{ url: string }> {
    const file = await this.extractSingleFile(req);
    const url = await this.uploadService.uploadImage(
      file.buffer,
      file.filename,
      file.mimetype,
      'banners',
    );
    return { url };
  }

  /**
   * Upload vendor logo
   */
  @Post('vendor-logo')
  async uploadVendorLogo(@Req() req: FastifyRequest): Promise<{ url: string }> {
    const file = await this.extractSingleFile(req);
    const url = await this.uploadService.uploadImage(
      file.buffer,
      file.filename,
      file.mimetype,
      'vendors',
    );
    return { url };
  }

  /**
   * Upload category icon
   */
  @Post('category-icon')
  async uploadCategoryIcon(@Req() req: FastifyRequest): Promise<{ url: string }> {
    const file = await this.extractSingleFile(req);
    const url = await this.uploadService.uploadImage(
      file.buffer,
      file.filename,
      file.mimetype,
      'categories',
    );
    return { url };
  }

  /**
   * Upload custom order images
   */
  @Post('custom-order-images')
  async uploadCustomOrderImages(@Req() req: FastifyRequest): Promise<{ urls: string[] }> {
    const files = await this.extractMultipleFiles(req);
    const urls = await this.uploadService.uploadMultipleImages(files, 'custom-orders');
    return { urls };
  }

  // ============================================
  // HELPER METHODS for Fastify Multipart
  // ============================================

  private async extractSingleFile(req: FastifyRequest): Promise<FileData> {
    const data = await req.file();
    
    if (!data) {
      throw new BadRequestException('No file uploaded');
    }

    const buffer = await data.toBuffer();
    
    return {
      buffer,
      filename: data.filename,
      mimetype: data.mimetype,
    };
  }

  private async extractMultipleFiles(req: FastifyRequest): Promise<FileData[]> {
    const files = await req.files();
    const fileDataArray: FileData[] = [];

    for await (const file of files) {
      const buffer = await file.toBuffer();
      fileDataArray.push({
        buffer,
        filename: file.filename,
        mimetype: file.mimetype,
      });
    }

    if (fileDataArray.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    return fileDataArray;
  }
}
