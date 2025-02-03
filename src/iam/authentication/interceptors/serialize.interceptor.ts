import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class SerializeInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T> | Promise<Observable<T>> {
    return next.handle().pipe(
      map((data: T) => {
        // TODO: Implement a way to map generic type T to a specific type
        return {
          ...data,
          id: undefined,
          createdAt: undefined,
          updatedAt: undefined,
          password: undefined,
          role: undefined,
        };
      }),
    );
  }
}
