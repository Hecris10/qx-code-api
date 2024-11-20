import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto } from 'src/user/dto/login-user.dto';

@Injectable()
export class AuthService {
  private tokenBlacklist: Set<string> = new Set();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user; // eslint-disable-line @typescript-eslint/no-unused-vars
      return result;
    }
    return null;
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.validateUser(
        loginUserDto.email,
        loginUserDto.password,
      );
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = { email: user.email, sub: user.id };
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      });
      return {
        access_token: accessToken,
      };
    } catch (error) {
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
