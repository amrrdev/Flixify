import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class WebHookCloudinary {
  @IsArray()
  tags: string[];

  @IsString()
  @IsNotEmpty()
  secure_url: string;

  @IsNumber()
  duration: number;

  @IsDate()
  created_at: Date;
}

/**
 * model Videos {
  id Int @default(autoincrement()) @id
  url String @unique
  title String @db.VarChar(110)
  description String
  video_rate VideoRating @default(NOT_RATED)
  durationInMinutes Int
  uploadedAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ViewingHistory ViewingHistories[]
  comments Comments[]
  likes Likes[]
}
 */
