import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('videos')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllVideos() {
    return this.usersService.getAllVideos();
  }
}
