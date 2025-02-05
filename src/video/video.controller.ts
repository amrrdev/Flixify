import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { VideoService } from './video.service';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enum/auth-type.enum';
import { WebHookCloudinary } from './dto/webhood.dto';
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { Role } from '../users/enums/roles.enum';
import { SubscriptionGuard } from '../iam/authorization/guards/subscriptions.guard';

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('signed-url')
  @Roles(Role.Admin)
  getSignedUploadUrl(@Query('tags') tags: string) {
    return this.videoService.getSignedUploadUrl(tags);
  }

  @Post('cloudinary-webhook')
  @Auth(AuthType.NONE)
  async handeCloudinaryHook(@Body() webHookCloudinary: WebHookCloudinary) {
    return await this.videoService.handleVideoUploadAndSave(webHookCloudinary);
  }

  @Get()
  @UseGuards(SubscriptionGuard)
  getAllVideos() {
    return this.videoService.getAllVideos();
  }
}
