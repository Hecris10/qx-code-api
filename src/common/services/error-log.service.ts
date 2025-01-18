import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service';

@Injectable()
export class ErrorLogService {
  constructor(private readonly prisma: PrismaService) {}

  async createErrorLog(data: {
    statusCode: number;
    message: string;
    userId?: number;
    path: string;
    method: string;
  }) {
    await this.prisma.errorLog.create({
      data: {
        statusCode: data.statusCode,
        message: data.message,
        userId: data.userId,
        path: data.path,
        method: data.method,
      },
    });
  }
}
