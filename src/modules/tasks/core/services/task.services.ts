import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from '../../dtos/task.dto';
import { Task } from '../entities/task.entity';
import { UserService } from 'src/modules/users/core/services/user.service';
import { ITaskRepository } from '../repositories';
import { PaginationResult } from 'src/core/interfaces/pagination-result.interface';

@Injectable()
export class TaskService {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepository: ITaskRepository,
    private readonly userService: UserService,
  ) {}

  async getAllTasks(
    page: number,
    limit: number,
  ): Promise<PaginationResult<Task>> {
    try {
      return await this.taskRepository.getAllTasks(page, limit);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error getting tasks');
    }
  }

  async getTaskById(taskId: number): Promise<Task> {
    try {
      return await this.taskRepository.getTaskById(taskId);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Error getting task with id: ${taskId}`,
      );
    }
  }

  async getTaskByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<PaginationResult<Task>> {
    try {
      return await this.taskRepository.getTaskByUserId(userId, page, limit);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Error getting tasks for user with id: ${userId}`,
      );
    }
  }

  async createTask(taskData: CreateTaskDto): Promise<Task> {
    try {
      await this.validateUser(taskData.assignedUser);

      return this.taskRepository.createTask(taskData);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error creating task');
    }
  }

  async updateTask(
    taskId: number,
    updateTaskData: Partial<Task>,
  ): Promise<Task> {
    const task = await this.taskRepository.getTaskById(taskId);
    if (!task) throw new NotFoundException(`Task with id: ${taskId} not found`);
    if (updateTaskData.assignedUser)
      await this.validateUser(updateTaskData.assignedUser);

    try {
      return await this.taskRepository.updateTask(taskId, updateTaskData);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error updating task');
    }
  }

  async deleteTask(taskId: number): Promise<boolean> {
    try {
      return await this.taskRepository.deleteTask(taskId);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Error deleting task with id: ${taskId}`,
      );
    }
  }

  private async validateUser(userId: number): Promise<void> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException(`User with id: ${userId} not found`);
  }
}
