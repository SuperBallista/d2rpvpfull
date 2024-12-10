import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Controller('/cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('/upload')
  async uploadImage(@Body('image') image: string) {
    if (!image) {
      throw new HttpException('No image provided', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.cloudinaryService.uploadImage(image);
      return {
        message: 'Image uploaded successfully',
        url: result.url,
        publicId: result.publicId,
      };
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw new HttpException('Failed to upload image', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
