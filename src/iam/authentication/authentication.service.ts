import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { SignUpDto } from './dto/sign-up.dto';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { MailService } from '../../integrations/mail/mail.service';

import * as crypto from 'node:crypto';
import { EmailType } from '../../integrations/mail/enum/email-types.enum';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigrations: ConfigType<typeof jwtConfig>,
    private readonly mailService: MailService,
  ) {}

  async changePassword(encodedToken: string, newPassword: string) {
    const token = decodeURIComponent(encodedToken);
    const resetRecord = await this.databaseService.resetPasswords.findFirst({
      where: { token: token },
    });

    if (!resetRecord) {
      throw new BadRequestException('Invalid Token or token expired');
    }

    if (resetRecord.expiration < new Date()) {
      throw new Error('Token has expired');
    }

    const user = await this.databaseService.users.findUnique({
      where: { id: resetRecord.userId },
    });

    if (!user) {
      throw new NotFoundException('we could no found you!');
    }
    const hashedPassword = await this.hashingService.hash(newPassword);

    await this.databaseService.users.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    return {
      message: 'Password has been successfully reset',
    };
  }

  async resetPassword(email: string) {
    const user = await this.databaseService.users.findFirst({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException(
        'No account found with this email address. Please check and try again.',
      );
    }

    const token = crypto.randomBytes(32).toString('base64'); // Use base64 encoding
    const encodedToken = encodeURIComponent(token); // URL encode the token
    await this.mailService.sendEmail(EmailType.ResetPassword, user.email, {
      resetToken: encodedToken,
    });

    await this.databaseService.resetPasswords.create({
      data: {
        userId: user.id,
        token,
        expiration: new Date(new Date().setHours(new Date().getHours() + 1)),
      },
    });

    return {
      message:
        'If this email is associated with an account, we have sent a verification/reset link to your inbox. Please check your email.',
    };
  }

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
