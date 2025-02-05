import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from './enums/roles.enum';
import { Roles } from '../iam/authorization/decorators/roles.decorator';

@Controller('users')
@Roles(Role.Admin)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
