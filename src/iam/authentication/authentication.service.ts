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
import { ActiveUserDate } from '../interfaces/active-user-data.interface';
import { Users } from '@prisma/client';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { StripeService } from '../../integrations/stripe/stripe.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigrations: ConfigType<typeof jwtConfig>,
    private readonly mailService: MailService,
    private readonly stripeService: StripeService,
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

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserDate>>(
        user.id,
        this.jwtConfigrations.accessTokenTtl,
        {
          email: user.email,
          role: user.role,
          stripeCustomerId: user.stripeCustomerId,
        },
      ),
      this.signToken(user.id, this.jwtConfigrations.refreshTokenTtl),
    ]);

    // TODO: Replace the cookie with a Bearer token and return both the access and refresh tokens for the frontend.

    return accessToken;
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      { sub: userId, ...payload },
      {
        secret: this.jwtConfigrations.secret,
        audience: this.jwtConfigrations.audience,
        issuer: this.jwtConfigrations.issuer,
        expiresIn,
      },
    );
  }

  async signup(signUpDto: SignUpDto) {
    const existingUser = await this.databaseService.users.findUnique({
      where: { email: signUpDto.email },
    });

    if (existingUser) {
      throw new BadRequestException(
        'Email is already registered. Please choose a different one',
      );
    }

    const stripeCustomer = await this.stripeService.createCustomer({
      email: signUpDto.email,
      name: signUpDto.firstName,
    });

    Object.assign(signUpDto, {
      ...signUpDto,
      password: await this.hashingService.hash(signUpDto.password),
    });

    const newUser = await this.databaseService.users.create({
      data: {
        ...signUpDto,
        stripeCustomerId: stripeCustomer.id,
      },
    });

    if (!newUser) {
      throw new InternalServerErrorException(
        'Failed to create the user. Please try again later.',
      );
    }
    return newUser;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserDate, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfigrations.secret,
        audience: this.jwtConfigrations.audience,
        issuer: this.jwtConfigrations.issuer,
      });

      const user = await this.databaseService.users.findUnique({
        where: { id: sub },
      });

      if (!user) {
        throw new NotFoundException('User does not exists');
      }

      // TODO: refactor this
      const [accessToken, refreshToken] = await Promise.all([
        this.signToken<Partial<ActiveUserDate>>(
          user.id,
          this.jwtConfigrations.accessTokenTtl,
          { email: user.email },
        ),
        this.signToken(user.id, this.jwtConfigrations.refreshTokenTtl),
      ]);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
