import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import {
  UnauthorizedException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { UserLoginDto, CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

describe('UserService', () => {
  let userService: UserService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;

  const mockUserRepository = {
    getAllUsers: jest.fn(),
    createUser: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    getUserByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: 'IUserRepository', useValue: mockUserRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'password',
    roles: ['user'],
    validatePassword: jest.fn(),
  };

  describe('getAllUsers', () => {
    it('should get all users', async () => {
      const users = [mockUser];
      mockUserRepository.getAllUsers.mockResolvedValue(users);

      expect(await userService.getAllUsers(1, 10)).toBe(users);
    });

    it('should handle getAllUsers with an error', async () => {
      mockUserRepository.getAllUsers.mockRejectedValue(new Error());

      await expect(userService.getAllUsers(1, 10)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password',
      };
      mockUserRepository.createUser.mockResolvedValue(mockUser);

      expect(await userService.createUser(createUserDto)).toBe(mockUser);
    });

    it('should handle createUser with an error', async () => {
      const createUserDto: CreateUserDto = {
        name: 'New User',
        email: '  ',
        password: 'password',
      };
      mockUserRepository.createUser.mockRejectedValue(new Error());

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should handle createUser with a duplicate user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'New User',
        email: '',
        password: 'password',
      };
      mockUserRepository.createUser.mockRejectedValue({
        code: 'ER_DUP_ENTRY',
      });

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getUserById', () => {
    it('should get a user by id', async () => {
      mockUserRepository.getUserById.mockResolvedValue(mockUser);

      expect(await userService.getUserById(1)).toBe(mockUser);
    });

    it('should handle getUserById with an error', async () => {
      mockUserRepository.getUserById.mockRejectedValue(new Error());

      await expect(userService.getUserById(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
        email: 'updated@example.com',
      };
      mockUserRepository.getUserById.mockResolvedValue(mockUser);
      mockUserRepository.updateUser.mockResolvedValue(mockUser);

      expect(await userService.updateUser(1, updateUserDto)).toBe(mockUser);
    });

    it('should handle updateUser with an error', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
        email: ' ',
      };
      mockUserRepository.getUserById.mockResolvedValue(mockUser);
      mockUserRepository.updateUser.mockRejectedValue(new Error());

      await expect(userService.updateUser(1, updateUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      mockUserRepository.getUserById.mockResolvedValue(mockUser);
      mockUserRepository.deleteUser.mockResolvedValue(mockUser);

      expect(await userService.deleteUser(1)).toBe(mockUser);
    });

    it('should handle deleteUser with an error', async () => {
      mockUserRepository.getUserById.mockResolvedValue(mockUser);
      mockUserRepository.deleteUser.mockRejectedValue(new Error());

      await expect(userService.deleteUser(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('login', () => {
    it('should login a user and return a token', async () => {
      const userLoginData: UserLoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const mockToken = 'mockToken';

      mockUserRepository.getUserByEmail.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue(mockToken);
      mockUser.validatePassword.mockResolvedValue(true);

      const result = await userService.login(userLoginData);

      expect(result).toEqual({ token: mockToken });
      expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(
        userLoginData.email,
      );
      expect(mockUser.validatePassword).toHaveBeenCalledWith(
        userLoginData.password,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { email: mockUser.email, sub: mockUser.id, roles: mockUser.roles },
        { secret: process.env.JWT_SECRET },
      );
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      const userLoginData: UserLoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockUserRepository.getUserByEmail.mockResolvedValue(mockUser);
      mockUser.validatePassword.mockResolvedValue(false);

      await expect(userService.login(userLoginData)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(
        userLoginData.email,
      );
    });

    it('should handle login with non-existing user', async () => {
      const userLoginData: UserLoginDto = {
        email: 'nonexistent@example.com',
        password: 'password',
      };

      mockUserRepository.getUserByEmail.mockResolvedValue(null);

      await expect(userService.login(userLoginData)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(
        userLoginData.email,
      );
    });

    it('should handle login with an error', async () => {
      const userLoginData: UserLoginDto = {
        email: '',
        password: 'password',
      };

      mockUserRepository.getUserByEmail.mockRejectedValue(new Error());

      await expect(userService.login(userLoginData)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
