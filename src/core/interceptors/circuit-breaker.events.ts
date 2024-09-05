import { Logger } from '@nestjs/common';
import { CircuitBreaker } from 'opossum';

export const registerCircuitBreakerEvents = (
  circuitBreaker: CircuitBreaker,
): void => {
  const events = {
    open: { message: 'Circuit Breaker is open', logMethod: 'error' },
    halfOpen: { message: 'Circuit Breaker is half open', logMethod: 'warn' },
    close: { message: 'Circuit Breaker is closed', logMethod: 'log' },
  };

  Object.entries(events).forEach(([event, { message, logMethod }]) => {
    circuitBreaker.on(event, () => Logger[logMethod](message));
  });
};
