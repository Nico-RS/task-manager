import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from '../../core/services/task.services';
import { CreateTaskDto } from '../../dtos/task.dto';
import { Task } from '../../core/entities/task.entity';
import { TaskStatus } from '../../core/enums/task.enum';
import { Role } from '../../../users/core/enums/user.enum';
import { UserService } from '../../../users/core/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../../core/guards/auth.guard';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';

describe('TaskController', () => {
  let taskController: TaskController;

  const mockTaskService = {
    createTask: jest.fn(),
    getAllTasks: jest.fn(),
    getTaskById: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  };

  const mockUserService = {
    createUser: jest.fn(),
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideInterceptor(CacheInterceptor)
      .useValue({ intercept: jest.fn((context, next) => next.handle()) })
      .compile();

    taskController = app.get<TaskController>(TaskController);
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        assignedUser: 1,
      };
      const result: Task = {
        id: 1,
        ...createTaskDto,
        status: TaskStatus.OPEN,
        user: {
          id: 1,
          email: 'test',
          name: 'test',
          password: 'test',
          roles: [Role.USER],
          tasks: [],
          hashPassword: async () => {},
          validatePassword: async () => true,
        },
      };

      mockTaskService.createTask.mockResolvedValue(result);
      expect(await taskController.createTask(createTaskDto)).toBe(result);
      expect(mockTaskService.createTask).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      const result: Task[] = [];

      mockTaskService.getAllTasks.mockResolvedValue(result);
      expect(await taskController.getAllTasks(1, 10)).toBe(result);
      expect(mockTaskService.getAllTasks).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      const result: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.OPEN,
        assignedUser: 1,
        user: {
          id: 1,
          email: 'test',
          name: 'test',
          password: 'test',
          roles: [Role.USER],
          tasks: [],
          hashPassword: async () => {},
          validatePassword: async () => true,
        },
      };

      mockTaskService.getTaskById.mockResolvedValue(result);
      expect(await taskController.getTaskById(1)).toBe(result);
      expect(mockTaskService.getTaskById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const updateTaskDto: Partial<Task> = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.IN_PROGRESS,
      };
      const result: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.IN_PROGRESS,
        assignedUser: 1,
        user: {
          id: 1,
          email: 'test',
          name: 'test',
          password: 'test',
          roles: [Role.USER],
          tasks: [],
          hashPassword: async () => {},
          validatePassword: async () => true,
        },
      };

      mockTaskService.updateTask.mockResolvedValue(result);
      expect(await taskController.updateTask(1, updateTaskDto)).toBe(result);
      expect(mockTaskService.updateTask).toHaveBeenCalledWith(1, updateTaskDto);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      mockTaskService.deleteTask.mockResolvedValue(true);
      expect(await taskController.deleteTask(1)).toBe(true);
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1);
    });
  });
});
