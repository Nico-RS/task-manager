import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from '../../core/services/user.service';
import { CreateUserDto, UpdateUserDto } from '../../core/dtos/user.dto';
import { User } from '../../core/entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post()
  createUser(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Patch()
  updateUser(@Body() updateUserData: UpdateUserDto): Promise<Partial<User>> {
    return this.userService.updateUser(updateUserData);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<boolean> {
    return this.userService.deleteUser(id);
  }
}
