import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { QRCodeController } from './qr-code.controller';
import { QRCodeService } from './qr-code.service';

@Module({
  imports: [PrismaModule],
  controllers: [QRCodeController],
  providers: [QRCodeService],
})
export class QRCodeModule {}
