import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError, firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as opossum from 'opossum';
import { registerCircuitBreakerEvents } from './circuit-breaker.events';

@Injectable()
export class CircuitBreakerInterceptor implements NestInterceptor {
  private circuitBreaker: any;
  private readonly SERVICE_UNAVAILABLE_MESSAGE =
    'Service is currently unavailable';

  constructor() {
    const options = {
      timeout: 3000,
      errorThresholdPercentage: 50,
      resetTimeout: 10000,
    };

    this.circuitBreaker = new opossum(this.execute.bind(this), options);

    registerCircuitBreakerEvents(this.circuitBreaker);
  }

  private async execute(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<any> {
    return firstValueFrom(next.handle());
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return new Observable((observer) => {
      this.circuitBreaker
        .fire(context, next)
        .then((result) => {
          observer.next(result);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    }).pipe(
      catchError((error) => {
        if (
          this.circuitBreaker.status.name === 'halfOpen' ||
          error instanceof HttpException
        ) {
          return throwError(() => error);
        }
        return throwError(
          () =>
            new HttpException(
              this.SERVICE_UNAVAILABLE_MESSAGE,
              HttpStatus.SERVICE_UNAVAILABLE,
            ),
        );
      }),
    );
  }
}
