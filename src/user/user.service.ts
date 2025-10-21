import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'argon2';

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

  async getUserByEmailWithPassword(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Користувача з таким email не існує.');
    }

    return user;
  }

  async create(dto: CreateUserDto) {
    const isExist = await this.userRepository.findOne({ where: { email: dto.email } });

    if (isExist) {
      throw new ConflictException('Користувач з таким email вже існує.');
    }

    const newUser = await this.userRepository.save({
      ...dto,
      password: await hash(dto.password),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
  }
}
