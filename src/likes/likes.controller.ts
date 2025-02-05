import { Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { LikesService } from './likes.service';
import { ActiveUser } from '../iam/decorators/active-user.decorator';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':videoId')
  createLike(
    @ActiveUser('sub') sub: number,
    @Param('videoId', ParseIntPipe) videoId: number,
  ) {
    return this.likesService.createLike(sub, videoId);
  }

  @Delete(':videoId')
  dislike(
    @ActiveUser('sub') sub: number,
    @Param('videoId', ParseIntPipe) videoId: number,
  ) {
    return this.likesService.dislike(sub, videoId);
  }
}
