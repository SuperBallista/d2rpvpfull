import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as cloudinary from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(base64Image: string, account): Promise<{ url: string; publicId: string }> {

    if (!base64Image) {
      throw new HttpException('이미지가 없습니다', HttpStatus.BAD_REQUEST);
    }
    if (!account) {
      throw new HttpException('로그인해야합니다', HttpStatus.UNAUTHORIZED);
    }
  
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
      throw new HttpException('이미지 업로드에 실패하였습니다', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
