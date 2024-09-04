import { Task } from '../entities/task.entity';

export interface ITaskRepository {
  getAllTasks(): Promise<Task[]>;
  getTaskById(taskId: number): Promise<Task>;
  getTaskByUserId(userId: number): Promise<Task[]>;
  createTask(taskData: Partial<Task>): Promise<Task>;
  updateTask(taskId: number, updateTaskData: Partial<Task>): Promise<Task>;
  deleteTask(taskId: number): Promise<boolean>;
}
