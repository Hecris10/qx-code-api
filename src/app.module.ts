import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as cookieParser from 'cookie-parser';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ErrorLogService } from './common/services/error-log.service';

import { AuthMiddleware } from './modules/auth/auth.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { LogosModule } from './modules/logos/logos.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { QRCodeControllerModule } from './modules/qr-code-controller/qr-code-controller.module';
import { QRCodeModule } from './modules/qr-codes/qr-codes.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule globally available
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    QRCodeModule,
    LogosModule,
    QRCodeControllerModule,
    JwtModule.register({
      secret: 'yourSecretKey', // Replace with your secret key
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ErrorLogService, PrismaService], // Register services
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser(), AuthMiddleware).forRoutes('*'); // Apply to all routes
  }
}
