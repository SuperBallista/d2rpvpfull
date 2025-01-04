import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: keyof { username: string, account: string; } | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // 특정 필드를 요청한 경우 해당 필드만 반환
    return data ? user?.[data] : user;
  },
  
);
