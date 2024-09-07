import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { EntityManager } from 'typeorm';
import { User } from '../../core/entities/user.entity';
import { PaginationResult } from '../../../../core/interfaces/pagination-result.interface';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let entityManager: EntityManager;

  const mockEntityManager = {
    getRepository: jest.fn().mockReturnThis(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    execute: jest.fn(),
    delete: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        { provide: EntityManager, useValue: mockEntityManager },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  describe('getAllUsers', () => {
    it('should return paginated users', async () => {
      const users: User[] = [new User()];
      const total = 1;
      mockEntityManager.getManyAndCount.mockResolvedValue([users, total]);

      const result: PaginationResult<User> = await userRepository.getAllUsers(
        1,
        10,
      );

      expect(result).toEqual({ data: users, total, page: 1, limit: 10 });
      expect(mockEntityManager.getRepository).toHaveBeenCalledWith(User);
      expect(mockEntityManager.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockEntityManager.skip).toHaveBeenCalledWith(0);
      expect(mockEntityManager.take).toHaveBeenCalledWith(10);
      expect(mockEntityManager.getManyAndCount).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const user = new User();
      mockEntityManager.getOne.mockResolvedValue(user);

      const result = await userRepository.getUserById(1);

      expect(result).toBe(user);
      expect(mockEntityManager.getRepository).toHaveBeenCalledWith(User);
      expect(mockEntityManager.createQueryBuilder).toHaveBeenCalled();
      expect(mockEntityManager.where).toHaveBeenCalledWith('id = :userId', {
        userId: 1,
      });
      expect(mockEntityManager.getOne).toHaveBeenCalled();
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const user = new User();
      mockEntityManager.getOne.mockResolvedValue(user);

      const result = await userRepository.getUserByEmail('test@example.com');

      expect(result).toBe(user);
      expect(mockEntityManager.getRepository).toHaveBeenCalledWith(User);
      expect(mockEntityManager.createQueryBuilder).toHaveBeenCalled();
      expect(mockEntityManager.where).toHaveBeenCalledWith('email = :email', {
        email: 'test@example.com',
      });
      expect(mockEntityManager.getOne).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const user = new User();
      mockEntityManager.create.mockReturnValue(user);
      mockEntityManager.save.mockResolvedValue(user);

      const result = await userRepository.createUser(user);

      expect(result).toBe(user);
      expect(mockEntityManager.create).toHaveBeenCalledWith(User, user);
      expect(mockEntityManager.save).toHaveBeenCalledWith(user);
    });
  });

  describe('updateUser', () => {
    it('should update and return the updated user', async () => {
      const user = new User();
      mockEntityManager.create.mockReturnValue(user);
      mockEntityManager.execute.mockResolvedValue({ affected: 1 });
      mockEntityManager.getOne.mockResolvedValue(user);

      const result = await userRepository.updateUser(1, user);

      expect(result).toBe(user);
      expect(mockEntityManager.create).toHaveBeenCalledWith(User, user);
      expect(mockEntityManager.update).toHaveBeenCalled();
      expect(mockEntityManager.set).toHaveBeenCalledWith(user);
      expect(mockEntityManager.where).toHaveBeenCalledWith('id = :userId', {
        userId: 1,
      });
      expect(mockEntityManager.execute).toHaveBeenCalled();
      expect(mockEntityManager.getOne).toHaveBeenCalledWith();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return true if successful', async () => {
      mockEntityManager.execute.mockResolvedValue({ affected: 1 });

      const result = await userRepository.deleteUser(1);

      expect(result).toBe(true);
      expect(mockEntityManager.delete).toHaveBeenCalled();
      expect(mockEntityManager.where).toHaveBeenCalledWith('id = :userId', {
        userId: 1,
      });
      expect(mockEntityManager.execute).toHaveBeenCalled();
    });

    it('should return false if no user was deleted', async () => {
      mockEntityManager.execute.mockResolvedValue({ affected: 0 });

      const result = await userRepository.deleteUser(1);

      expect(result).toBe(false);
      expect(mockEntityManager.delete).toHaveBeenCalled();
      expect(mockEntityManager.where).toHaveBeenCalledWith('id = :userId', {
        userId: 1,
      });
      expect(mockEntityManager.execute).toHaveBeenCalled();
    });
  });
});
