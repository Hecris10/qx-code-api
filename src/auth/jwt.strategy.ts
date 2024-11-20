import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(payload);
    if (this.authService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token has been blacklisted');
    }
    return { userId: payload.sub, email: payload.email };
  }
}
