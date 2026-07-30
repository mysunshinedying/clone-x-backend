import { Module } from '@nestjs/common';
import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Feed } from './feed.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Feed]),
    JwtModule.register({
      secret: 'random-secret-key',
      signOptions: { expiresIn: '600m' },
    }),
  ],
  controllers: [FeedsController],
  providers: [FeedsService],
})
export class FeedsModule {}
