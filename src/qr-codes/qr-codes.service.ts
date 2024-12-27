import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQRCodeDto } from './dto/create-qr-code.dto';
import { UpdatePartialQRCodeDto } from './dto/update-partial-qr-code.dtop';
import { UpdateQRCodeDto } from './dto/update-qr-code.dto';

const includeQrCodeLogo = {
  logo: {
    select: {
      id: true,
      url: true,
    },
  },
};
@Injectable()
export class QRCodeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQRCodeDto: CreateQRCodeDto, userId: number) {
    const type = createQRCodeDto.type;

    switch (type) {
      case 'text':
        if (!createQRCodeDto.text) {
          throw new BadRequestException('Text is required');
        }
        break;
      case 'wifi':
        if (!createQRCodeDto.ssid) {
          throw new BadRequestException('SSID is required');
        }
        if (!createQRCodeDto.password) {
          throw new BadRequestException('Password is required');
        }
        break;
      case 'url':
        if (!createQRCodeDto.link) {
          throw new BadRequestException('Link is required');
        }
        break;
      default:
        if (!createQRCodeDto.content) {
          throw new BadRequestException('Content is required');
        }
        break;
    }

    return this.prisma.qRCode.create({
      data: {
        name: createQRCodeDto.name,
        type: createQRCodeDto.type || '',
        content: createQRCodeDto.content || '',
        link: createQRCodeDto.link || '',
        ssid: createQRCodeDto.ssid || '',
        password: createQRCodeDto.password || '',
        text: createQRCodeDto.text || '',
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

  async updatePartial(id: number, updateQRCodeDto: UpdatePartialQRCodeDto) {
    return this.prisma.qRCode.update({
      where: { id },
      data: { ...updateQRCodeDto, logoId: updateQRCodeDto.logoId || undefined },
    });
  }

  async remove(userId: number, id: number) {
    return this.prisma.qRCode.delete({
      where: {
        id,
        userId,
      },
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
          include: includeQrCodeLogo,
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

  async findOne(userId: number, id: number) {
    const qrCode = await this.prisma.qRCode.findFirst({
      include: includeQrCodeLogo,
      where: {
        id,
        userId,
      },
    });
    if (!qrCode) throw new NotFoundException('QR code not found');

    return qrCode;
  }

  async addLogo(userId: number, qrCodeId: number, logoId: number) {
    const qrCode = await this.prisma.qRCode.findFirst({
      where: {
        id: qrCodeId,
        userId,
      },
    });
    if (!qrCode) throw new NotFoundException('QR code not found');

    return this.prisma.qRCode.update({
      where: { id: qrCodeId },
      include: {
        logo: {
          select: {
            id: true,
            url: true,
          },
        },
      },
      data: {
        logoId,
      },
    });
  }

  async removeLogo({
    userId,
    qrCodeId,
    logoId,
  }: {
    userId: number;
    qrCodeId: number;
    logoId: number;
  }) {
    const qrCode = await this.prisma.qRCode.findFirst({
      where: {
        id: qrCodeId,
        userId,
        logoId,
      },
    });
    if (!qrCode) throw new NotFoundException('QR code not found');

    return this.prisma.qRCode.update({
      where: { id: qrCodeId },
      data: {
        logoId: null,
        logoBackgroundColor: null,
        logoBorderRadius: null,
        logoPadding: null,
      },
    });
  }
}
