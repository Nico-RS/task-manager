import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { IUserRepository } from '../interfaces/repositories';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.getAllUsers();
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error getting users');
    }
  }

  async getUserById(userId: number): Promise<User> {
    try {
      return await this.userRepository.getUserById(userId);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error getting user');
    }
  }

  private async getUserByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.getUserByEmail(email);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error getting user');
    }
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.createUser(userData);
    } catch (error) {
      Logger.error(error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException('Error creating user');
      }
    }
  }

  async updateUser(
    userId: number,
    updateUserData: UpdateUserDto,
  ): Promise<Partial<User>> {
    const user = await this.getUserById(userId);

    if (!user) throw new NotFoundException('User not found');

    try {
      return await this.userRepository.updateUser(user.id, updateUserData);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async deleteUser(userId: number): Promise<boolean> {
    try {
      return await this.userRepository.deleteUser(userId);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error deleting user');
    }
  }
}
