import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import cloudinaryConfig from './config/cloudinary.config';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [ConfigModule.forFeature(cloudinaryConfig)],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
