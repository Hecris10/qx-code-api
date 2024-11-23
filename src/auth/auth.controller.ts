import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    return this.authService.login(loginUserDto, res);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req: Request) {
    const token = req.cookies['access_token'];
    return this.authService.logout(token);
  }

  @Get('verify')
  @UseGuards(AuthGuard('jwt'))
  async verify(@Req() req: Request) {
    return { message: 'User is logged in', user: req.user };
  }

  @Post('verify-token')
  async verifyToken(@Body('token') token: string) {
    try {
      const decoded = this.jwtService.verify(token.replace('Bearer ', ''), {
        secret: process.env.JWT_SECRET,
      });
      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}
