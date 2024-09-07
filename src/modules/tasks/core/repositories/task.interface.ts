import { PaginationResult } from '../../../../core/interfaces/pagination-result.interface';
import { Task } from '../entities/task.entity';

export interface ITaskRepository {
  getAllTasks(page: number, limit: number): Promise<PaginationResult<Task>>;
  getTaskById(taskId: number): Promise<Task>;
  getTaskByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<PaginationResult<Task>>;
  createTask(taskData: Partial<Task>): Promise<Task>;
  updateTask(taskId: number, updateTaskData: Partial<Task>): Promise<Task>;
  deleteTask(taskId: number): Promise<boolean>;
}
