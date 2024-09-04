import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskService } from '../../core/services/task.services';
import { CreateTaskDto, UpdateTaskDto } from '../../dtos/task.dto';
import { Task } from '../../core/entities/task.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAllTasks(): Promise<Task[]> {
    return this.taskService.getAllTasks();
  }

  @Get(':taskId')
  getTaskById(@Param('taskId') taskId: number): Promise<Task> {
    return this.taskService.getTaskById(taskId);
  }

  @Get('user/:userId')
  getTaskByUserId(@Param('userId') userId: number): Promise<Task[]> {
    return this.taskService.getTaskByUserId(userId);
  }

  @Post()
  createTask(@Body() taskData: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(taskData);
  }

  @Patch(':taskId')
  updateTask(
    @Body() updateTaskData: UpdateTaskDto,
    @Param('taskId') taskId: number,
  ): Promise<Task> {
    return this.taskService.updateTask(taskId, updateTaskData);
  }

  @Delete(':id')
  deleteTask(@Param() id): Promise<boolean> {
    return this.taskService.deleteTask(id);
  }
}
