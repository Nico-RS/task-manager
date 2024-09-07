/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ITaskRepository } from '../repositories';
import { UserService } from '../../../users/core/services/user.service';
import { CreateTaskDto } from '../../dtos/task.dto';
import { Task } from '../entities/task.entity';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaginationResult } from '../../../../core/interfaces/pagination-result.interface';
import { TaskService } from './task.services';

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepository: ITaskRepository;
  let userService: UserService;

  const mockTaskRepository = {
    getAllTasks: jest.fn(),
    getTaskById: jest.fn(),
    getTaskByUserId: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  };

  const mockUserService = {
    getUserById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: 'ITaskRepository', useValue: mockTaskRepository },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskRepository = module.get<ITaskRepository>('ITaskRepository');
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTasks', () => {
    it('should return paginated tasks', async () => {
      const tasks: Task[] = [new Task()];
      const total = 1;
      const paginationResult: PaginationResult<Task> = {
        data: tasks,
        total,
        page: 1,
        limit: 10,
      };
      mockTaskRepository.getAllTasks.mockResolvedValue(paginationResult);

      const result = await taskService.getAllTasks(1, 10);

      expect(result).toEqual(paginationResult);
      expect(mockTaskRepository.getAllTasks).toHaveBeenCalledWith(1, 10);
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      mockTaskRepository.getAllTasks.mockRejectedValue(new Error('Error'));

      await expect(taskService.getAllTasks(1, 10)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      const task = new Task();
      mockTaskRepository.getTaskById.mockResolvedValue(task);

      const result = await taskService.getTaskById(1);

      expect(result).toBe(task);
      expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(1);
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      mockTaskRepository.getTaskById.mockRejectedValue(new Error('Error'));

      await expect(taskService.getTaskById(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getTaskByUserId', () => {
    it('should return paginated tasks by user id', async () => {
      const tasks: Task[] = [new Task()];
      const total = 1;
      const paginationResult: PaginationResult<Task> = {
        data: tasks,
        total,
        page: 1,
        limit: 10,
      };
      mockTaskRepository.getTaskByUserId.mockResolvedValue(paginationResult);

      const result = await taskService.getTaskByUserId(1, 1, 10);

      expect(result).toEqual(paginationResult);
      expect(mockTaskRepository.getTaskByUserId).toHaveBeenCalledWith(1, 1, 10);
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      mockTaskRepository.getTaskByUserId.mockRejectedValue(new Error('Error'));

      await expect(taskService.getTaskByUserId(1, 1, 10)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('createTask', () => {
    it('should create and return a new task', async () => {
      const taskData: CreateTaskDto = {
        title: 'Test Task',
        assignedUser: 1,
        description: '',
      };
      const task = new Task();
      mockUserService.getUserById.mockResolvedValue({});
      mockTaskRepository.createTask.mockResolvedValue(task);

      const result = await taskService.createTask(taskData);

      expect(result).toBe(task);
      expect(mockUserService.getUserById).toHaveBeenCalledWith(1);
      expect(mockTaskRepository.createTask).toHaveBeenCalledWith(taskData);
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      const taskData: CreateTaskDto = {
        title: 'Test Task',
        assignedUser: 1,
        description: '',
      };
      mockUserService.getUserById.mockResolvedValue({});
      mockTaskRepository.createTask.mockRejectedValue(
        new InternalServerErrorException('Error creating task'),
      );

      await expect(taskService.createTask(taskData)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw a NotFoundException if the user does not exist', async () => {
      const taskData: CreateTaskDto = {
        title: 'Test Task',
        assignedUser: 1,
        description: '',
      };
      mockUserService.getUserById.mockResolvedValue(null);

      await expect(taskService.createTask(taskData)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTask', () => {
    it('should update and return the updated task', async () => {
      const task = new Task();
      const updateTaskData: Partial<Task> = {
        title: 'Updated Task',
        assignedUser: 1,
      };
      mockTaskRepository.getTaskById.mockResolvedValue(task);
      mockUserService.getUserById.mockResolvedValue({});
      mockTaskRepository.updateTask.mockResolvedValue(task);

      const result = await taskService.updateTask(1, updateTaskData);

      expect(result).toBe(task);
      expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(1);
      expect(mockUserService.getUserById).toHaveBeenCalledWith(1);
      expect(mockTaskRepository.updateTask).toHaveBeenCalledWith(
        1,
        updateTaskData,
      );
    });

    it('should throw a NotFoundException if the task does not exist', async () => {
      const updateTaskData: Partial<Task> = {
        title: 'Updated Task',
        assignedUser: 1,
      };
      mockTaskRepository.getTaskById.mockResolvedValue(null);

      await expect(taskService.updateTask(1, updateTaskData)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      const task = new Task();
      const updateTaskData: Partial<Task> = {
        title: 'Updated Task',
        assignedUser: 1,
      };
      mockTaskRepository.getTaskById.mockResolvedValue(task);
      mockUserService.getUserById.mockResolvedValue({});
      mockTaskRepository.updateTask.mockRejectedValue(new Error('Error'));

      await expect(taskService.updateTask(1, updateTaskData)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete a task and return true if successful', async () => {
      mockTaskRepository.deleteTask.mockResolvedValue(true);

      const result = await taskService.deleteTask(1);

      expect(result).toBe(true);
      expect(mockTaskRepository.deleteTask).toHaveBeenCalledWith(1);
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      mockTaskRepository.deleteTask.mockRejectedValue(new Error('Error'));

      await expect(taskService.deleteTask(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('validateUser', () => {
    it('should throw a NotFoundException if the user does not exist', async () => {
      mockUserService.getUserById.mockResolvedValue(null);

      await expect(taskService['validateUser'](1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should not throw if the user exists', async () => {
      mockUserService.getUserById.mockResolvedValue({});

      await expect(taskService['validateUser'](1)).resolves.not.toThrow();
    });
  });
});
