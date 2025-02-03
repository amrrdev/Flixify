import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../integrations/cloudinary/cloudinary.service';
import { WebHookCloudinary } from './dto/webhood.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class VideoService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly databaseService: DatabaseService,
  ) {}

  async getSignedUploadUrl(tags: string) {
    return await this.cloudinaryService.generateSignedUploadUrl(tags);
  }

  async handleVideoUploadAndSave(webHookCloudinary: WebHookCloudinary) {
    let [title, description] = webHookCloudinary.tags[0].split('|');
    title = title.trim();
    description = description.trim();
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
}
