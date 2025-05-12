import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

interface RequestWithAuth {
  headers: {
    authorization?: string;
  };
  user?: any;
}

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('optional-jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      request.user = null;
      return true;
    }

    try {
      await super.canActivate(context);
      const user = request.user;

      if (!user) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  private extractTokenFromHeader(request: RequestWithAuth): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }

  handleRequest<TUser = any>(
    err: any,
    user: TUser,
    info: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context: ExecutionContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _status?: any,
  ): TUser | null | false {
    if (
      info &&
      (info.message === 'No auth token' || info.message === 'No auth token')
    ) {
      // acesso anônimo
      return null;
    }
    if (err || info || !user) {
      return false;
    }
    return user;
  }
}
