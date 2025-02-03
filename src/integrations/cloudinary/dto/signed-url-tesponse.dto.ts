export class SignedUrlResponseDto {
  cloud_name: string;
  api_key: string;
  signature: string;
  timestamp: number;
  folder: string;
  resource_type: 'video';
}
