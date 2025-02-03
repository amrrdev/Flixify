import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { VideoService } from './video.service';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enum/auth-type.enum';
import { WebHookCloudinary } from './dto/webhood.dto';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('signed-url')
  getSignedUploadUrl(@Query('tags') tags: string) {
    return this.videoService.getSignedUploadUrl(tags);
  }

  @Post('cloudinary-webhook')
  @Auth(AuthType.NONE)
  async handeCloudinaryHook(@Body() webHookCloudinary: WebHookCloudinary) {
    return await this.videoService.handleVideoUploadAndSave(webHookCloudinary);
  }
}
