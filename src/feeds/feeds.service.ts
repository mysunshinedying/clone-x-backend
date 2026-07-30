import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from './feed.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(Feed)
    private feedRepository: Repository<Feed>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getFeeds() {
    return this.feedRepository.find({ order: { created_at: 'DESC' } });
  }

  async createFeed(feed: CreateFeedDto, userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newFeed = this.feedRepository.create({
      content: feed.content,
      user,
    });

    return await this.feedRepository.save(newFeed);
  }

  async deleteFeed(id: number) {
    return await this.feedRepository.delete(id);
  }

  async getFeedsWithUsers() {
    const feeds = await this.feedRepository.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    const feedsWithUserInfo = feeds.map((feed) => ({
      ...feed,
      user: {
        id: feed.user.id,
        name: feed.user.name,
      },
    }));

    return feedsWithUserInfo;
  }
}
