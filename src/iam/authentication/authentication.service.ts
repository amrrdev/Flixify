import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { SignUpDto } from './dto/sign-up.dto';
import { HashingService } from '../hashing/hashing.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly hashingService: HashingService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    const existingUser = await this.databaseService.users.findUnique({
      where: { email: signUpDto.email },
    });

    if (existingUser)
      throw new BadRequestException(
        'Email is already registered. Please choose a different one',
      );

    Object.assign(signUpDto, {
      ...signUpDto,
      password: await this.hashingService.hash(signUpDto.password),
    });
    // TODO: PLEASE DO NOT FORGET THIS
    console.log(signUpDto);
    const newUser = await this.databaseService.users.create({
      data: signUpDto,
    });

    if (!newUser) {
      throw new InternalServerErrorException(
        'Failed to create the user. Please try again later.',
      );
    }
    return newUser;
  }
}
