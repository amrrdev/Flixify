import { Inject, Injectable } from '@nestjs/common';
import { v2 as cloudinary, ConfigOptions, SignApiOptions } from 'cloudinary';
import { ConfigType } from '@nestjs/config';
import cloudinaryConfig from './config/cloudinary.config';
import { SignedUrlResponseDto } from './dto/signed-url-tesponse.dto';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject(cloudinaryConfig.KEY)
    private readonly cloudinaryConfigrations: ConfigType<
      typeof cloudinaryConfig
    >,
  ) {
    cloudinary.config({
      cloud_name: this.cloudinaryConfigrations.cloudinaryName,
      api_key: this.cloudinaryConfigrations.cloudinaryApiKey,
      api_secret: this.cloudinaryConfigrations.cloudinaryApiSecret,
    });
  }

  async generateSignedUploadUrl(tags: string): Promise<SignedUrlResponseDto> {
    const timestamp = Math.round(Date.now() / 1000) * 1000;

    const paramsToSign: Record<string, any> = {
      folder: 'videos',
      timestamp,
      tags: [tags],
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      this.cloudinaryConfigrations.cloudinaryApiSecret as string,
    );

    return {
      cloud_name: this.cloudinaryConfigrations.cloudinaryName as string,
      api_key: this.cloudinaryConfigrations.cloudinaryApiKey as string,
      signature,
      timestamp,
      tags: [tags],
      folder: paramsToSign.folder,
      resource_type: paramsToSign.resource_type as 'video',
    } as SignedUrlResponseDto;
  }
}
