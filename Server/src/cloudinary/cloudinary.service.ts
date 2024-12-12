import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as cloudinary from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(base64Image: string): Promise<{ url: string; publicId: string }> {
    try {
      const result = await cloudinary.v2.uploader.upload(base64Image, {
        folder: 'uploads',
        resource_type: 'image',
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new HttpException('Failed to upload image', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
