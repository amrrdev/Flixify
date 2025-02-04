import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { DatabaseModule } from '../database/database.module';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { DatabaseService } from '../database/database.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './authentication/config/jwt.config';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { MailModule } from '../integrations/mail/mail.module';
import { RolesGuard } from './authorization/guards/roles.guard';
import { StripeModule } from '../integrations/stripe/stripe.module';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    DatabaseModule,
    MailModule,
    StripeModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AccessTokenGuard,
    AuthenticationService,
    DatabaseService,
    Reflector,
  ],
})
export class IamModule {}
