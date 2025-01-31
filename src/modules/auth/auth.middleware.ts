import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { originalUrl } = req;
    if (
      originalUrl.includes('/auth/login') ||
      originalUrl.includes('/auth/logout') ||
      originalUrl.includes('/user/signup') ||
      originalUrl.includes('/health') ||
      (originalUrl.includes('/qr-code-controller') && req.method === 'POST')
    ) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      req.user = decoded;
      next();
    } catch (error: any) {
      console.error('Error verifying token:', error);
      throw new UnauthorizedException(`Invalid token: ${error.message}`);
    }
  }
}
