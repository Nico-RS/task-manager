import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn(),
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard, { provide: JwtService, useValue: mockJwtService }],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw UnauthorizedException if token is not found', async () => {
    const request = {
      headers: {},
    } as Request;

    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue(request);

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    const request = {
      headers: {
        authorization: 'Bearer invalidtoken',
      },
    } as Request;

    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue(request);
    mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should return true if token is valid', async () => {
    const request = {
      headers: {
        authorization: 'Bearer validtoken',
      },
    } as Request;

    const payload = { userId: 1 };
    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue(request);
    mockJwtService.verifyAsync.mockResolvedValue(payload);

    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
    expect(request['user']).toBe(payload);
  });

  it('should extract token from header correctly', () => {
    const request = {
      headers: {
        authorization: 'Bearer validtoken',
      },
    } as Request;

    const token = guard['extractTokenFromHeader'](request);
    expect(token).toBe('validtoken');
  });

  it('should return undefined if authorization header is not Bearer', () => {
    const request = {
      headers: {
        authorization: 'Basic someothertoken',
      },
    } as Request;

    const token = guard['extractTokenFromHeader'](request);
    expect(token).toBeUndefined();
  });
});
