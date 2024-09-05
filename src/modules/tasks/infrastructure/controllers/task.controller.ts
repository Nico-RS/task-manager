import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TaskService } from '../../core/services/task.services';
import { CreateTaskDto, UpdateTaskDto } from '../../dtos/task.dto';
import { Task } from '../../core/entities/task.entity';
import { Role } from 'src/modules/users/core/enum/user.enum';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { TaskOwnerGuard } from '../../core/guards/task-owner.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { PaginationResult } from 'src/core/interfaces/pagination-result.interface';
import { PAGINATION } from 'src/core/constants/constants';

@Controller('tasks')
@UseGuards(AuthGuard, RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @Roles(Role.ADMIN)
  @UseInterceptors(CacheInterceptor)
  getAllTasks(
    @Query('page') page: number = PAGINATION.DEFAULT_PAGE,
    @Query('limit') limit: number = PAGINATION.DEFAULT_LIMIT,
  ): Promise<PaginationResult<Task>> {
    return this.taskService.getAllTasks(page, limit);
  }

  @Get(':taskId')
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(TaskOwnerGuard)
  getTaskById(@Param('taskId') taskId: number): Promise<Task> {
    return this.taskService.getTaskById(taskId);
  }

  @Get('user/:assignedUser')
  @UseGuards(TaskOwnerGuard)
  @Roles(Role.USER, Role.ADMIN)
  @UseInterceptors(CacheInterceptor)
  getTaskByUserId(
    @Param('assignedUser') userId: number,
    @Query('page') page: number = PAGINATION.DEFAULT_PAGE,
    @Query('limit') limit: number = PAGINATION.DEFAULT_LIMIT,
  ): Promise<PaginationResult<Task>> {
    return this.taskService.getTaskByUserId(userId, page, limit);
  }

  @Post()
  @Roles(Role.ADMIN)
  createTask(@Body() taskData: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(taskData);
  }

  @Patch(':taskId')
  @UseGuards(TaskOwnerGuard)
  @Roles(Role.USER, Role.ADMIN)
  updateTask(
    @Body() updateTaskData: UpdateTaskDto,
    @Param('taskId') taskId: number,
  ): Promise<Task> {
    return this.taskService.updateTask(taskId, updateTaskData);
  }

  @Delete(':taskId')
  @Roles(Role.ADMIN)
  deleteTask(@Param() taskId): Promise<boolean> {
    return this.taskService.deleteTask(taskId);
  }
}
