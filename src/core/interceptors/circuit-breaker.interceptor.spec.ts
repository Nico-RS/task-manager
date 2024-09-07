import { Test, TestingModule } from '@nestjs/testing';
import { CircuitBreakerInterceptor } from './circuit-breaker.interceptor';
import {
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { of, firstValueFrom } from 'rxjs';

jest.mock('opossum');

describe('CircuitBreakerInterceptor', () => {
  let interceptor: CircuitBreakerInterceptor;
  let mockContext: ExecutionContext;
  let mockNext: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CircuitBreakerInterceptor],
    }).compile();

    interceptor = module.get<CircuitBreakerInterceptor>(
      CircuitBreakerInterceptor,
    );
    mockContext = {} as ExecutionContext;
    mockNext = {
      handle: jest.fn(),
    } as unknown as CallHandler;
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should intercept and return a successful response', async () => {
    const result = 'success';
    mockNext.handle = jest.fn(() => of(result));
    (interceptor['circuitBreaker'].fire as jest.Mock).mockResolvedValue(result);

    const response = await firstValueFrom(
      interceptor.intercept(mockContext, mockNext),
    );
    expect(response).toBe(result);
  });

  it('should return SERVICE_UNAVAILABLE when circuit is open', async () => {
    const error = new Error('Circuit error');
    (interceptor['circuitBreaker'].fire as jest.Mock).mockRejectedValue(error);
    interceptor['circuitBreaker'].status = { name: 'open' };

    try {
      await firstValueFrom(interceptor.intercept(mockContext, mockNext));
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.message).toBe(interceptor['SERVICE_UNAVAILABLE_MESSAGE']);
      expect(err.getStatus()).toBe(HttpStatus.SERVICE_UNAVAILABLE);
    }
  });

  it('should return original error when circuit is halfOpen', async () => {
    const error = new Error('Circuit error');
    (interceptor['circuitBreaker'].fire as jest.Mock).mockRejectedValue(error);
    interceptor['circuitBreaker'].status = { name: 'halfOpen' };

    try {
      await firstValueFrom(interceptor.intercept(mockContext, mockNext));
    } catch (err) {
      expect(err).toBe(error);
    }
  });
});
