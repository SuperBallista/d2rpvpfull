import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';

@Global() // 전역으로 사용할 경우
@Module({
  providers: [
    {
      provide: 'CLOUDINARY',
      useFactory: (configService: ConfigService) => {
        cloudinary.config({
          cloud_name: configService.get('CLOUD_NAME'),
          api_key: configService.get('CLOUD_API_KEY'),
          api_secret: configService.get('CLOUD_API_SECRET'),
        });
        return cloudinary;
      },
      inject: [ConfigService],
    },
    CloudinaryService,
  ],
  exports: ['CLOUDINARY'],
  controllers: [CloudinaryController],
})
export class CloudinaryModule {}
