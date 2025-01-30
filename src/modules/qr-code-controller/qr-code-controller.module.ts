import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { QrCodeControllerController } from './qr-code-controller.controller';
import { QrCodeControllerService } from './qr-code-controller.service';

@Module({
  imports: [PrismaModule],
  controllers: [QrCodeControllerController],
  providers: [QrCodeControllerService],
})
export class QRCodeControllerModule {}
