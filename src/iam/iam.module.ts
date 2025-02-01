import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { DatabaseModule } from '../database/database.module';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [AuthenticationController],
  providers: [
    DatabaseModule,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthenticationService,
    DatabaseService,
  ],
})
export class IamModule {}
