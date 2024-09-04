import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ITaskRepository } from '../../core/repositories';
import { Task } from '../../core/entities/task.entity';

export class TaskRepository implements ITaskRepository {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return this.entityManager
      .getRepository(Task)
      .createQueryBuilder()
      .select()
      .getMany();
  }

  async getTaskById(taskId: number): Promise<Task> {
    return this.entityManager
      .getRepository(Task)
      .createQueryBuilder()
      .where('id = :taskId', { taskId })
      .getOne();
  }

  async getTaskByUserId(userId: number): Promise<Task[]> {
    return this.entityManager
      .getRepository(Task)
      .createQueryBuilder()
      .where('userId = :userId', { userId })
      .getMany();
  }

  async createTask(taskData: Partial<Task>): Promise<Task> {
    return this.entityManager.getRepository(Task).save(taskData);
  }

  async updateTask(taskId: number, task: Partial<Task>): Promise<Task> {
    await this.entityManager
      .getRepository(Task)
      .createQueryBuilder()
      .update()
      .set(task)
      .where('id = :taskId', { taskId })
      .execute();

    return this.entityManager
      .getRepository(Task)
      .createQueryBuilder('task')
      .where('task.id = :taskId', { taskId })
      .getOne();
  }

  async deleteTask(taskId: number): Promise<boolean> {
    const result = await this.entityManager
      .getRepository(Task)
      .createQueryBuilder()
      .delete()
      .where('id = :taskId', { taskId })
      .execute();

    return result.affected > 0;
  }
}
