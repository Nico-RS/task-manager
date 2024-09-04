import {
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

  async getUserById(id: string): Promise<User> {
    try {
      return await this.userRepository.getUserById(id);
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

  async createUser(user: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.createUser(user);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async updateUser(updateUserData: UpdateUserDto): Promise<Partial<User>> {
    const user = await this.getUserByEmail(updateUserData.email);

    if (!user) throw new NotFoundException('User not found');

    try {
      return this.userRepository.updateUser(
        user.id?.toString(),
        updateUserData,
      );
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      return await this.userRepository.deleteUser(id);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error deleting user');
    }
  }
}
