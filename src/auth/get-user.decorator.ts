import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return (req as Request & { user: User }).user;
  },
);
