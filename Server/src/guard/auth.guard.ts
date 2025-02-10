import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 컨트롤러 또는 핸들러에 정의된 역할 가져오기
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true; // 역할 제한이 없는 경우 통과

    // 요청 객체에서 user 정보 가져오기
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) return false; // 사용자 정보가 없으면 접근 차단

    // 사용자의 역할이 requiredRoles 목록에 포함되어 있으면 접근 허용
    return requiredRoles.includes(user.role);
  }
}
