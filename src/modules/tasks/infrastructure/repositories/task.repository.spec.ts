import { Test, TestingModule } from '@nestjs/testing';
import { TaskRepository } from './task.repository';
import { EntityManager } from 'typeorm';
import { Task } from '../../core/entities/task.entity';
import { PaginationResult } from '../../../../core/interfaces/pagination-result.interface';

describe('TaskRepository', () => {
  let taskRepository: TaskRepository;
  let entityManager: EntityManager;

  const mockEntityManager = {
    getRepository: jest.fn().mockReturnThis(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    execute: jest.fn(),
    delete: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskRepository,
        { provide: EntityManager, useValue: mockEntityManager },
      ],
    }).compile();

    taskRepository = module.get<TaskRepository>(TaskRepository);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  describe('getAllTasks', () => {
    it('should return paginated tasks', async () => {
      const tasks: Task[] = [new Task()];
      const total = 1;
      mockEntityManager.getManyAndCount.mockResolvedValue([tasks, total]);

      const result: PaginationResult<Task> = await taskRepository.getAllTasks(
        1,
        10,
      );

      expect(result).toEqual({ data: tasks, total, page: 1, limit: 10 });
      expect(mockEntityManager.getRepository).toHaveBeenCalledWith(Task);
      expect(mockEntityManager.createQueryBuilder).toHaveBeenCalledWith();
      expect(mockEntityManager.skip).toHaveBeenCalledWith(0);
      expect(mockEntityManager.take).toHaveBeenCalledWith(10);
      expect(mockEntityManager.getManyAndCount).toHaveBeenCalled();
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      const task = new Task();
      mockEntityManager.getOne.mockResolvedValue(task);

      const result = await taskRepository.getTaskById(1);

      expect(result).toBe(task);
      expect(mockEntityManager.getRepository).toHaveBeenCalledWith(Task);
      expect(mockEntityManager.createQueryBuilder).toHaveBeenCalled();
      expect(mockEntityManager.where).toHaveBeenCalledWith('id = :taskId', {
        taskId: 1,
      });
      expect(mockEntityManager.getOne).toHaveBeenCalled();
    });
  });

  describe('getTaskByUserId', () => {
    it('should return paginated tasks by user id', async () => {
      const tasks: Task[] = [new Task()];
      const total = 1;
      mockEntityManager.getManyAndCount.mockResolvedValue([tasks, total]);

      const result: PaginationResult<Task> =
        await taskRepository.getTaskByUserId(1, 1, 10);

      expect(result).toEqual({ data: tasks, total, page: 1, limit: 10 });
      expect(mockEntityManager.getRepository).toHaveBeenCalledWith(Task);
      expect(mockEntityManager.createQueryBuilder).toHaveBeenCalledWith('task');
      expect(mockEntityManager.where).toHaveBeenCalledWith(
        'task.assignedUser = :userId',
        { userId: 1 },
      );
      expect(mockEntityManager.skip).toHaveBeenCalledWith(0);
      expect(mockEntityManager.take).toHaveBeenCalledWith(10);
      expect(mockEntityManager.getManyAndCount).toHaveBeenCalled();
    });
  });

  describe('createTask', () => {
    it('should create and return a new task', async () => {
      const task = new Task();
      mockEntityManager.save.mockResolvedValue(task);

      const result = await taskRepository.createTask(task);

      expect(result).toBe(task);
      expect(mockEntityManager.save).toHaveBeenCalledWith(task);
    });
  });

  describe('updateTask', () => {
    it('should update and return the updated task', async () => {
      const task = new Task();
      mockEntityManager.execute.mockResolvedValue({ affected: 1 });
      mockEntityManager.getOne.mockResolvedValue(task);

      const result = await taskRepository.updateTask(1, task);

      expect(result).toBe(task);
      expect(mockEntityManager.update).toHaveBeenCalled();
      expect(mockEntityManager.set).toHaveBeenCalledWith(task);
      expect(mockEntityManager.where).toHaveBeenCalledWith('id = :taskId', {
        taskId: 1,
      });
      expect(mockEntityManager.execute).toHaveBeenCalled();
      expect(mockEntityManager.getOne).toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task and return true if successful', async () => {
      mockEntityManager.execute.mockResolvedValue({ affected: 1 });

      const result = await taskRepository.deleteTask(1);

      expect(result).toBe(true);
      expect(mockEntityManager.delete).toHaveBeenCalled();
      expect(mockEntityManager.where).toHaveBeenCalledWith('id = :taskId', {
        taskId: 1,
      });
      expect(mockEntityManager.execute).toHaveBeenCalled();
    });

    it('should return false if no task was deleted', async () => {
      mockEntityManager.execute.mockResolvedValue({ affected: 0 });

      const result = await taskRepository.deleteTask(1);

      expect(result).toBe(false);
      expect(mockEntityManager.delete).toHaveBeenCalled();
      expect(mockEntityManager.where).toHaveBeenCalledWith('id = :taskId', {
        taskId: 1,
      });
      expect(mockEntityManager.execute).toHaveBeenCalled();
    });
  });
});
