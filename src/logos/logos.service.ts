import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LogosService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, name: string, url: string) {
    return this.prisma.logoImage.create({
      data: {
        name,
        url,
        userId,
      },
    });
  }

  async delete(userId: number, logoId: number) {
    const logo = await this.prisma.logoImage.findUnique({
      where: {
        id: logoId,
      },
    });

    if (!logo) {
      throw new Error('Logo not found');
    }

    if (logo.userId !== userId) {
      throw new Error('Unauthorized');
    }

    await this.prisma.logoImage.delete({
      where: {
        id: logoId,
      },
    });

    return logo;
  }

  async findAllByUser(userId: number) {
    return this.prisma.logoImage.findMany({
      orderBy: {
        id: 'desc',
      },
      where: {
        userId,
      },
    });
  }
}
