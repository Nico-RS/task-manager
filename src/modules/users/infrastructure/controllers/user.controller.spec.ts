import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../../core/services/user.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
describe('UserController', () => {
  let userController: UserController;

  const mockUserService = {
    getAllUsers: jest.fn(),
    createUser: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    })
      .overrideInterceptor(CacheInterceptor)
      .useValue({ intercept: jest.fn((context, next) => next.handle()) })
      .compile();

    userController = app.get<UserController>(UserController);
  });

  const user = {
    name: '',
    email: '',
    password: '',
  };

  describe('getAllUsers', () => {
    it('should get all user', async () => {
      const users = [user];
      mockUserService.getAllUsers.mockResolvedValue(users);

      expect(await userController.getAllUsers()).toBe(users);
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      mockUserService.createUser.mockResolvedValue(user);

      expect(await userController.createUser(user)).toBe(user);
    });
  });

  describe('getUserById', () => {
    it('should get a user by id', async () => {
      mockUserService.getUserById.mockResolvedValue(user);

      expect(await userController.getUserById(1)).toBe(user);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      mockUserService.updateUser.mockResolvedValue(user);

      expect(await userController.updateUser(1, user)).toBe(user);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      mockUserService.deleteUser.mockResolvedValue(user);

      expect(await userController.deleteUser(1)).toBe(user);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginData = {
        email: '',
        password: '',
      };

      const mockToken = 'token';
      mockUserService.login.mockResolvedValue(mockToken);

      expect(await userController.login(loginData)).toBe(mockToken);
    });
  });
});
