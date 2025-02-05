import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class LikesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createLike(sub: number, videoId: number) {
    try {
      const like = await this.databaseService.likes.create({
        data: { userId: sub, videoId: videoId },
      });
    } catch (err) {
      throw new BadRequestException('can not create like on this video');
    }
    return {
      message: `You seem to enjoy this video! 🎥 (${videoId})}`,
    };
  }
  async dislike(sub: number, videoId: number) {
    try {
      const like = await this.databaseService.likes.findFirst({
        where: { videoId, userId: sub },
      });

      if (!like) {
        throw new BadRequestException("You haven't liked this video yet.");
      }

      await this.databaseService.likes.delete({
        where: { id: like.id },
      });

      return { message: 'You have disliked the video successfully.' };
    } catch (err) {
      throw new BadRequestException('Unable to dislike this video.');
    }
  }
}
