// src/auth/auth.service.ts
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { LoginUserDto } from 'src/modules/user/dto/login-user.dto';
import { validateEmail } from 'src/utilts/validation';
import { UserAuth } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private tokenBlacklist: Set<string> = new Set();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserAuth | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user; // eslint-disable-line @typescript-eslint/no-unused-vars
      return result;
    }
    return null;
  }

  async login(loginUserDto: LoginUserDto, res: Response) {
    try {
      const isEmailValid = validateEmail(loginUserDto.email);

      if (!isEmailValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const user = await this.validateUser(
        loginUserDto.email,
        loginUserDto.password,
      );
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = { ...user, sub: user.id };
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      });
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      });
      return res.send({
        message: 'Login successful',
        accessToken: `${accessToken}`,
      });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Error during login:', error);
      throw new InternalServerErrorException('Failed to login');
    }
  }

  async logout(token: string) {
    this.tokenBlacklist.add(token);
    return { message: 'Logged out successfully' };
  }

  isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }
}
