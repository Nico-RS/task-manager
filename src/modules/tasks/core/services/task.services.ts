import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../../dtos/task.dto';

@Injectable()
export class TaskService {
  getAllTasks(): string {
    return 'All tasks';
  }

  getTaskById(id: string): string {
    return `Task by id ${id}`;
  }

  createTask(taskData: CreateTaskDto): CreateTaskDto {
    return taskData;
  }

  updateTask(updateTaskData): string {
    return `Update task with data: ${updateTaskData}`;
  }

  deleteTask(id): string {
    return `Delete task with id: ${id}`;
  }
}
