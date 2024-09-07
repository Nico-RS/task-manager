import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { Role } from '../../../users/core/enums/user.enum';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let reflector: Reflector;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn(),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesGuard, { provide: Reflector, useValue: mockReflector }],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if no roles are required', () => {
    mockReflector.getAllAndOverride.mockReturnValue(undefined);

    const result = guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('should deny access if user has no roles', () => {
    mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);
    const request = {
      user: {},
    };
    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue(request);

    const result = guard.canActivate(mockExecutionContext);
    expect(result).toBe(false);
  });

  it('should deny access if user roles do not match required roles', () => {
    mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);
    const request = {
      user: {
        roles: [Role.USER],
      },
    };
    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue(request);

    const result = guard.canActivate(mockExecutionContext);
    expect(result).toBe(false);
  });

  it('should allow access if user roles match required roles', () => {
    mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);
    const request = {
      user: {
        roles: [Role.ADMIN],
      },
    };
    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue(request);

    const result = guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });
});
