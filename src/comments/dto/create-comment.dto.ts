import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  videoId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
