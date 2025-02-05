import { IsNumber } from 'class-validator';

export class DeleteCommentDto {
  @IsNumber()
  commentId: number;

  @IsNumber()
  videoId: number;
}
