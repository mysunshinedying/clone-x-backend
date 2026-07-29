import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  getAllUser() {
    return 'getAllUser';
  }
  async login(loginDto: { email: string; password: string }) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!loginDto.email) {
      throw new HttpException(
        'Email must not be null or empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!loginDto.password) {
      throw new HttpException(
        'Password must not be null or empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user && !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = { id: user.id, email: user.email };

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      access_token: this.jwtService.sign(payload),
    };
  }

  async createUser(user: { name: string; email: string; password: string }) {
    if (!user.email) {
      throw new HttpException(
        'Email must not be null or empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!user.name) {
      throw new HttpException(
        'Name must not be null or empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!user.password) {
      throw new HttpException(
        'Password must not be null or empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = {
      name: user.name,
      email: user.email,
      password: hashedPassword,
    };

    return this.usersRepository.save(newUser);
  }
}
