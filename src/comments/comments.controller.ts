import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { DeleteCommentDto } from './dto/delete-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @ActiveUser('sub') sub: number,
  ) {
    return this.commentsService.createComment(sub, createCommentDto);
  }

  @Get(':videoId')
  getAllCommentsForVideo(@Param('videoId', ParseIntPipe) videoId: number) {
    return this.commentsService.getAllCommentsForVideo(videoId);
  }

  @Delete()
  deleteComment(
    @Body() deleteCommentDto: DeleteCommentDto,
    @ActiveUser('sub') sub: number,
  ) {
    return this.commentsService.deleteComment(sub, deleteCommentDto);
  }
}
