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

  @Get(':userId')
  getUserById(@Param('userId') userId: number): Promise<User> {
    return this.userService.getUserById(userId);
  }

  @Post()
  createUser(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Patch(':userId')
  updateUser(
    @Body() updateUserData: UpdateUserDto,
    @Param('userId') userId: number,
  ): Promise<Partial<User>> {
    return this.userService.updateUser(userId, updateUserData);
  }

  @Delete(':userId')
  deleteUser(@Param('userId') userId: number): Promise<boolean> {
    return this.userService.deleteUser(userId);
  }
}
