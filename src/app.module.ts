import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IamModule } from './iam/iam.module';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './integrations/mail/mail.service';
import { MailModule } from './integrations/mail/mail.module';
import { CloudinaryModule } from './integrations/cloudinary/cloudinary.module';
import { VideoModule } from './video/video.module';
import { UsersModule } from './users/users.module';
import { StripeModule } from './integrations/stripe/stripe.module';

@Module({
  imports: [
    DatabaseModule,
    IamModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailModule,
    CloudinaryModule,
    VideoModule,
    UsersModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
