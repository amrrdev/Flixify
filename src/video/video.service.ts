import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../integrations/cloudinary/cloudinary.service';
import { WebHookCloudinary } from './dto/webhood.dto';
import { DatabaseService } from '../database/database.service';
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { Role } from '../users/enums/roles.enum';

@Injectable()
export class VideoService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Roles(Role.Admin)
  async getSignedUploadUrl(tags: string) {
    return await this.cloudinaryService.generateSignedUploadUrl(tags);
  }

  async handleVideoUploadAndSave(webHookCloudinary: WebHookCloudinary) {
    let [title, description] = webHookCloudinary.tags[0].split('|');

    const newVideo = await this.databaseService.videos.create({
      data: {
        url: webHookCloudinary.secure_url,
        title,
        description,
        durationInMinutes: webHookCloudinary.duration / 60,
        uploadedAt: webHookCloudinary.created_at,
      },
    });
    return newVideo;
  }

  async getAllVideos() {
    return this.databaseService.videos.findMany();
  }
}
