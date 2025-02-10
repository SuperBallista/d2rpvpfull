import { Controller, Post, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { User } from 'src/user/user.decorator';
import { RolesGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/guard/roles.decorator';

@Controller('/cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('/upload')
    @UseGuards(RolesGuard)
    @Roles("admin", "user")
  async uploadImage(@Body('image') image: string, @User("account") account) {

      const result = await this.cloudinaryService.uploadImage(image, account);
      return {
        message: 'Image uploaded successfully',
        url: result.url,
        publicId: result.publicId,
      };
  }
}
