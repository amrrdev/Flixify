import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createComment(sub: number, createCommentDto: CreateCommentDto) {
    try {
      return await this.databaseService.comments.create({
        data: {
          content: createCommentDto.content,
          userId: sub,
          videoId: createCommentDto.videoId,
        },
      });
    } catch (err) {
      throw new BadRequestException('can not create comment, try again');
    }
  }

  async getAllCommentsForVideo(videoId: number) {
    return await this.databaseService.comments.findMany({
      where: {
        videoId: videoId,
      },
    });
  }

  async deleteComment(userId: number, deleteComment: DeleteCommentDto) {
    try {
      const res = await this.databaseService.comments.delete({
        where: {
          id: +deleteComment.commentId,
          userId: +userId,
          videoId: +deleteComment.videoId,
        },
      });
    } catch (err) {
      throw new BadRequestException('we could not remove the comment');
    }

    return {
      message: 'deleted successfully',
    };
  }
}
