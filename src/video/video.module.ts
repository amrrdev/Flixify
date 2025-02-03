import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { CloudinaryModule } from '../integrations/cloudinary/cloudinary.module';
import { VideoController } from './video.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [CloudinaryModule, DatabaseModule],
  providers: [VideoService],
  controllers: [VideoController],
})
export class VideoModule {}
