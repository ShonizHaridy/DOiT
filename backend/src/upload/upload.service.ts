import { Injectable, BadRequestException } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';

export type UploadFolder = 'products' | 'heroes' | 'banners' | 'vendors' | 'custom-orders' | 'categories';

@Injectable()
export class UploadService {
  private readonly uploadPath = join(process.cwd(), 'uploads');
  private readonly allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  constructor() {
    this.ensureUploadDir();
  }

  /**
   * Ensure upload directory and subdirectories exist
   */
  private async ensureUploadDir() {
    if (!existsSync(this.uploadPath)) {
      await mkdir(this.uploadPath, { recursive: true });
    }

    const subdirs: UploadFolder[] = ['products', 'heroes', 'banners', 'vendors', 'custom-orders', 'categories'];
    for (const dir of subdirs) {
      const path = join(this.uploadPath, dir);
      if (!existsSync(path)) {
        await mkdir(path, { recursive: true });
      }
    }
  }

  /**
   * Upload a single image
   */
  async uploadImage(
    file: Buffer,
    filename: string,
    mimetype: string,
    folder: UploadFolder = 'products',
  ): Promise<string> {
    // Validate file type
    if (!this.allowedImageTypes.includes(mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed: ${this.allowedImageTypes.join(', ')}`,
      );
    }

    // Validate file size
    if (file.length > this.maxFileSize) {
      throw new BadRequestException(
        `File too large. Max size: ${this.maxFileSize / (1024 * 1024)}MB`,
      );
    }

    // Generate unique filename
    const ext = mimetype.split('/')[1];
    const uniqueFilename = `${Date.now()}-${randomBytes(8).toString('hex')}.jpg`;
    const filepath = join(this.uploadPath, folder, uniqueFilename);

    // Save file
    await writeFile(filepath, file);

    // Return URL path
    return `/uploads/${folder}/${uniqueFilename}`;
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(
    files: Array<{ buffer: Buffer; filename: string; mimetype: string }>,
    folder: UploadFolder = 'products',
  ): Promise<string[]> {
    const uploadPromises = files.map((file) =>
      this.uploadImage(file.buffer, file.filename, file.mimetype, folder),
    );

    return Promise.all(uploadPromises);
  }
}