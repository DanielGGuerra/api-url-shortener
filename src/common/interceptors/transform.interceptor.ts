import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassTransformOptions, instanceToPlain } from 'class-transformer';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly options?: ClassTransformOptions) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data): unknown => {
        if (data && typeof data === 'object') {
          const transformed = instanceToPlain(data, this.options || {});
          return transformed;
        }
        return data;
      }),
    );
  }
}
