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
import { CreateTaskDto } from '../../dtos/task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAllTasks(): string {
    return this.taskService.getAllTasks();
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): string {
    return this.taskService.getTaskById(id);
  }

  @Post()
  createTask(@Body() taskData: CreateTaskDto): CreateTaskDto {
    return this.taskService.createTask(taskData);
  }

  @Patch()
  updateTask(@Body() updateTaskData: Partial<CreateTaskDto>): string {
    return this.taskService.updateTask(updateTaskData);
  }

  @Delete(':id')
  deleteTask(@Param() id): string {
    return this.taskService.deleteTask(id);
  }
}
