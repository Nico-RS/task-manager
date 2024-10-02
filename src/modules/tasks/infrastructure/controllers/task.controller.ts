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
import { Task } from '../../core/entities/task.entity';
import { Role } from '../../../users/core/enums/user.enum';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { TaskOwnerGuard } from '../../core/guards/task-owner.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { PaginationResult } from '../../../../core/interfaces/pagination-result.interface';
import { PAGINATION } from '../../../../core/constants/constants';
import { CircuitBreakerInterceptor } from '../../../../core/interceptors/circuit-breaker.interceptor';
import {
  CreateTaskDto,
  ManageStatusDto,
  UpdateTaskDto,
} from '../../core/dtos/task.dto';

@Controller('tasks')
@UseGuards(AuthGuard, RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @Roles(Role.ADMIN)
  @UseInterceptors(CacheInterceptor)
  @UseInterceptors(CircuitBreakerInterceptor)
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
  @Roles(Role.ADMIN, Role.USER)
  createTask(@Body() taskData: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(taskData);
  }

  @Patch(':taskId')
  @UseGuards(TaskOwnerGuard)
  @Roles(Role.USER, Role.ADMIN)
  updateTask(
    @Param('taskId') taskId: number,
    @Body() updateTaskData: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.updateTask(taskId, updateTaskData);
  }

  @Delete(':taskId')
  @Roles(Role.ADMIN)
  deleteTask(@Param('taskId') taskId: number): Promise<boolean> {
    return this.taskService.deleteTask(taskId);
  }

  @Post('/manage-task/:taskId')
  @Roles(Role.ADMIN)
  manageTask(
    @Param('taskId') taskId: number,
    @Body() taskAprovedStatus: ManageStatusDto,
  ): Promise<Task> {
    return this.taskService.manageTask(taskId, taskAprovedStatus);
  }
}
