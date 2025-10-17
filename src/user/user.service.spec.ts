import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const id = 'ea34aef7-c9a3-4b5c-b8ef-41e97525e88c';

  const user = {
    id,
    username: 'User',
    email: 'user@example.com',
    phone: '123',
    role: 'USER',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: getRepositoryToken(User), useValue: mockRepo }],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return users array', async () => {
    const users = [user];
    repo.find = jest.fn().mockResolvedValue(users);

    const result = await service.getAllUsers();

    expect(result).toEqual(users);
  });

  it('should return empty array if user not found', async () => {
    const users = [];
    repo.find = jest.fn().mockResolvedValue(users);

    const result = await service.getAllUsers();

    expect(result).toEqual(users);
  });

  it('should return user by id', async () => {
    repo.findOne = jest.fn().mockResolvedValue(user);

    const result = await service.findById(id);

    expect(result).toEqual(user);
  });

  it('should throw NotFoundException if user not found', async () => {
    repo.findOne = jest.fn().mockResolvedValue(null);

    await expect(service.findById(id)).rejects.toThrow('Користувача з таким id не існує.');
  });
});
