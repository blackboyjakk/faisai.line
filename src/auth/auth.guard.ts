import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AxiosError } from 'axios';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verify } from 'crypto';

export const IS_PUBLIC_KEY = 'isPublic';
export const IS_ADMIN_KEY = 'isAdmin';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Admin = () => SetMetadata(IS_ADMIN_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService,
    private reflector: Reflector,) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isAdmin) {
      // 💡 See this condition
      return true;
    }

    const req :Request = context.switchToHttp().getRequest();
    const res :Response = context.switchToHttp().getResponse();
    const token = this.authService.extractTokenFromHeader(req.headers.authorization);
    if (!token) {
      throw new UnauthorizedException('Session not found');
    }
    const payload = await this.authService.verifyAsync(req.headers.authorization);
    
    if (this.isTokenExpired(payload)) {
      throw new UnauthorizedException('Session Expired');
    }

    const user = await this.authService.getUser(payload.sub)
    const employee = await this.authService.getEmployee(user.empId)
    const roles = employee.mapRoles.map(m=> m.roleCode)

    if (!user) {

      res.status(HttpStatus.TEMPORARY_REDIRECT).send('/auth');
      
      // res.redirect('/auth')
      return false;
    }
    // 💡 We're assigning the payload to the request object here
    // so that we can access it in our route handlers
    req['userId'] = payload.sub;
    req['user'] = user;
    req['employee'] = employee;
    req['roles'] = roles;

    return true;
  }

  private isTokenExpired(decoded) {
    const expiry = decoded.exp;
    return (Math.floor((new Date()).getTime() / 1000)) >= expiry;
  }
}