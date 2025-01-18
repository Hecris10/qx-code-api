import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { LogosController } from './logos.controller';
import { LogosService } from './logos.service';

@Module({
  imports: [PrismaModule],
  controllers: [LogosController],
  providers: [LogosService],
})
export class LogosModule {}
