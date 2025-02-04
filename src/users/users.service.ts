import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async newSubscription(
    userId: number,
    planName: 'Basic' | 'Premium',
    state: 'Active' | 'NotSubscribed',
  ) {
    const currentDate = new Date();
    const endDate = new Date(currentDate);

    endDate.setMonth(endDate.getMonth() + 1);
    await this.databaseService.subscriptions.create({
      data: {
        userId,
        endDate,
        planId: planName === 'Basic' ? 1 : 2,
        status: state,
      },
    });
    console.log('new subscription 🥳🥂🍾💙');
  }

  async getAllVideos() {
    return await this.databaseService.videos.findMany({});
  }
}
