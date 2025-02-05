import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { CloudinaryModule } from '../integrations/cloudinary/cloudinary.module';
import { VideoController } from './video.controller';
import { DatabaseModule } from '../database/database.module';
import { IamModule } from '../iam/iam.module';

@Module({
  imports: [CloudinaryModule, DatabaseModule],
  providers: [VideoService],
  controllers: [VideoController],
  exports: [VideoService],
})
export class VideoModule {}
