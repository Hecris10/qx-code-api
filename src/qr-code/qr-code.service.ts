import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQRCodeDto } from './dto/create-qr-code.dto';
import { UpdateQRCodeDto } from './dto/update-qr-code.dto';

@Injectable()
export class QRCodeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQRCodeDto: CreateQRCodeDto, userId: number) {
    return this.prisma.qRCode.create({
      data: {
        ...createQRCodeDto,
        userId,
      },
    });
  }

  async update(id: number, updateQRCodeDto: UpdateQRCodeDto) {
    return this.prisma.qRCode.update({
      where: { id },
      data: updateQRCodeDto,
    });
  }

  async remove(id: number) {
    return this.prisma.qRCode.delete({
      where: { id },
    });
  }

  async findAll(userId: number, { page, limit, startDate, endDate }) {
    const where = {
      userId,
      createdAt: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
    };

    const [total, data] = await Promise.all([
      this.prisma.qRCode.count({ where }),
      this.prisma.qRCode.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      total,
      data,
      page,
      limit,
    };
  }
}
