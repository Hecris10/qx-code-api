import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { QRCodeController } from './qr-codes.controller';
import { QRCodeService } from './qr-codes.service';

@Module({
  imports: [PrismaModule],
  controllers: [QRCodeController],
  providers: [QRCodeService],
})
export class QRCodeModule {}
