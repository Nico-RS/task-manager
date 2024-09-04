import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
    return await this.userRepository.getAllUsers();
  }

  async getUserById(id: string): Promise<User> {
    return this.userRepository.getUserById(id);
  }

  private async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.getUserByEmail(email);
  }

  async createUser(user: CreateUserDto): Promise<User> {
    return this.userRepository.createUser(user);
  }

  async updateUser(updateUserData: UpdateUserDto): Promise<Partial<User>> {
    const user = await this.getUserByEmail(updateUserData.email);
    if (!user) throw new NotFoundException('User not found');

    return this.userRepository.updateUser(user.id?.toString(), updateUserData);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.deleteUser(id);
  }
}
