import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { DatabaseModule } from '../database/database.module';
import { LikesController } from './likes.controller';

@Module({
  imports: [DatabaseModule],
  providers: [LikesService],
  controllers: [LikesController],
})
export class LikesModule {}
