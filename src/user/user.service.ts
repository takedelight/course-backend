import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  private readonly returnedUserData: (keyof User)[] = [
    'createdAt',
    'email',
    'id',
    'password',
    'phone',
    'role',
    'updatedAt',
    'username',
  ];

  async getAllUsers() {
    return await this.userRepository.find({
      select: this.returnedUserData,
    });
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: this.returnedUserData,
    });

    if (!user) {
      throw new NotFoundException('Користувача з таким id не існує.');
    }

    return user;
  }
}
