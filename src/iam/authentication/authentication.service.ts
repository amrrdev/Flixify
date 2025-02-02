import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { SignUpDto } from './dto/sign-up.dto';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigrations: ConfigType<typeof jwtConfig>,
  ) {}

  async login(signInDto: SignInDto) {
    const user = await this.databaseService.users.findUnique({
      where: { email: signInDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isEquals = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );

    if (!isEquals) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        secret: this.jwtConfigrations.secret,
        expiresIn: this.jwtConfigrations.accessTokenTtl,
        audience: this.jwtConfigrations.audience,
        issuer: this.jwtConfigrations.issuer,
      },
    );

    return accessToken;
  }

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
