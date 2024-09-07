import { Test, TestingModule } from '@nestjs/testing';
import { TaskOwnerGuard } from './task-owner.guard';
import { TaskService } from '../services/task.services';
import {
  ExecutionContext,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '../../../users/core/enums/user.enum';

describe('TaskOwnerGuard', () => {
  let guard: TaskOwnerGuard;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let taskService: TaskService;

  const mockTaskService = {
    getTaskById: jest.fn(),
    getTaskByUserId: jest.fn(),
  };

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn(),
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskOwnerGuard,
        { provide: TaskService, useValue: mockTaskService },
      ],
    }).compile();

    guard = module.get<TaskOwnerGuard>(TaskOwnerGuard);
    taskService = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if user is admin', async () => {
    const request = {
      user: {
        roles: [Role.ADMIN],
      },
    };
    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue(request);

    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('should throw BadRequestException if taskId and assignedUser are missing', async () => {
    const request = {
      user: {
        roles: [Role.USER],
      },
      params: {},
    };
    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue(request);

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw NotFoundException if task is not found', async () => {
    const request = {
      user: {
        roles: [Role.USER],
        sub: 1,
      },
      params: {
        taskId: '1',
      },
    };
    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue(request);
    mockTaskService.getTaskById.mockResolvedValue(null);

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw UnauthorizedException if user does not own the task', async () => {
    const request = {
      user: {
        roles: [Role.USER],
        sub: 1,
      },
      params: {
        taskId: '1',
      },
    };
    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue(request);
    mockTaskService.getTaskById.mockResolvedValue({ assignedUser: 2 });

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should allow access if user owns the task', async () => {
    const request = {
      user: {
        roles: [Role.USER],
        sub: 1,
      },
      params: {
        taskId: '1',
      },
    };
    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue(request);
    mockTaskService.getTaskById.mockResolvedValue({ assignedUser: 1 });

    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException if no tasks found for assigned user', async () => {
    const request = {
      user: {
        roles: [Role.USER],
        sub: 1,
      },
      params: {
        assignedUser: '2',
      },
    };
    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue(request);
    mockTaskService.getTaskByUserId.mockResolvedValue({ total: 0 });

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if user does not own the tasks', async () => {
    const request = {
      user: {
        roles: [Role.USER],
        sub: 1,
      },
      params: {
        assignedUser: '2',
      },
    };
    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue(request);
    mockTaskService.getTaskByUserId.mockResolvedValue({ total: 1 });

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should allow access if user owns the tasks', async () => {
    const request = {
      user: {
        roles: [Role.USER],
        sub: 1,
      },
      params: {
        assignedUser: '1',
      },
    };
    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue(request);
    mockTaskService.getTaskByUserId.mockResolvedValue({ total: 1 });

    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });
});
