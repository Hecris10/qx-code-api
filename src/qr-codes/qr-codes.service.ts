import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    try {
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
          take: parseInt(limit, 10), // Ensure 'take' is an integer
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      return {
        total,
        data,
        page,
        limit,
      };
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      throw new InternalServerErrorException('Failed to fetch QR codes');
    }
  }
}
