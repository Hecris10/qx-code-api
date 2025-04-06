import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { endOfWeek, startOfWeek, subMonths } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';
import { QrCodesScansFilter } from './dto/qr-codes-stats.dto';
import {
  CreateQRCodeDto,
  UpdatePartialQRCodeDto,
  UpdateQRCodeDto,
} from './dto/qr-codes.dto';

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
        if (!createQRCodeDto.security) {
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
        backgroundColor: '#ffffff',
        cornersColor: '##000000',
        nodesColor: '#000000',
        logoBackgroundColor: '#00000000',
        dotsType: 'square',
        cornerType: 'square',
        logoBorderRadius: 0,
        padding: 4,
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

  async findAll(
    userId: number,
    {
      page,
      limit,
      startDate,
      endDate,
      isControlled,
      type,
    }: {
      page: number;
      limit: string;
      startDate?: string;
      endDate?: string;
      isControlled?: boolean;
      type?: string;
    },
  ) {
    try {
      const where = {
        userId,
        type: type || undefined,
        isControlled: isControlled !== undefined ? isControlled : undefined,
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      };
      const data = await this.prisma.qRCode.findMany({
        include: includeQrCodeLogo,
        where,
        skip: (page - 1) * parseInt(limit, 10),
        take: parseInt(limit), // Ensure 'take' is an integer
        orderBy: { createdAt: 'desc' },
      });

      return {
        total: data.length,
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

  async countControlled({ userId }: { userId: number }) {
    const count = await this.prisma.qRCode.count({
      where: {
        userId,
        isControlled: true,
      },
    });
    return count;
  }

  async getQrCodeName(userId: number, id: number) {
    const qrCode = await this.prisma.qRCode.findFirst({
      where: {
        id,
        userId,
      },
    });
    if (!qrCode) throw new NotFoundException('QR code not found');
    return qrCode.name;
  }

  async getQrCodeStats(userId: number) {
    const now = new Date();
    const lastMonth = subMonths(now, 1);
    const startOfThisWeek = startOfWeek(now);
    const endOfThisWeek = endOfWeek(now);

    // Total QR codes with difference from last month
    const totalQrCodes = await this.prisma.qRCode.count({
      where: { userId },
    });

    const totalQrCodesLastMonth = await this.prisma.qRCode.count({
      where: {
        userId,
        createdAt: {
          gte: lastMonth,
          lt: now,
        },
      },
    });

    const totalQrCodesDifference = totalQrCodes - totalQrCodesLastMonth;

    // Total scans with percent more or less than last month
    const totalScans = await this.prisma.qrCodeController.count({
      where: {
        qrCode: {
          userId,
        },
      },
    });

    const totalScansLastMonth = await this.prisma.qrCodeController.count({
      where: {
        qrCode: {
          userId,
        },
        createdAt: {
          gte: lastMonth,
          lt: now,
        },
      },
    });

    const totalScansDifferencePercent =
      totalScansLastMonth > 0
        ? ((totalScans - totalScansLastMonth) / totalScansLastMonth) * 100
        : 0;

    // Active QR codes with difference from last month in percent
    const activeQrCodes = await this.prisma.qRCode.count({
      where: {
        userId,
        isControlled: true,
      },
    });

    const activeQrCodesLastMonth = await this.prisma.qRCode.count({
      where: {
        userId,
        isControlled: true,
        createdAt: {
          gte: lastMonth,
          lt: now,
        },
      },
    });

    const activeQrCodesDifferencePercent =
      activeQrCodesLastMonth > 0
        ? ((activeQrCodes - activeQrCodesLastMonth) / activeQrCodesLastMonth) *
          100
        : 0;

    // Expiring this week with difference from last month in percent
    const expiringThisWeek = await this.prisma.qRCode.count({
      where: {
        userId,
        expirationDate: {
          gte: startOfThisWeek,
          lte: endOfThisWeek,
        },
      },
    });

    const expiringLastMonth = await this.prisma.qRCode.count({
      where: {
        userId,
        expirationDate: {
          gte: startOfThisWeek,
          lte: endOfThisWeek,
        },
        createdAt: {
          gte: lastMonth,
          lt: now,
        },
      },
    });

    const expiringDifferencePercent =
      expiringLastMonth > 0
        ? ((expiringThisWeek - expiringLastMonth) / expiringLastMonth) * 100
        : 0;

    return {
      totalQrCodes,
      totalQrCodesDifference,
      totalScans,
      totalScansDifferencePercent,
      activeQrCodes,
      activeQrCodesDifferencePercent,
      expiringThisWeek,
      expiringDifferencePercent,
    };
  }

  async getQrCodesScans(userId: number, filter: QrCodesScansFilter) {
    const now = new Date();
    const startDate = new Date();
    let dateFormatter = (date: Date) =>
      new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(date);

    switch (filter) {
      case '30_DAYS':
        startDate.setDate(now.getDate() - 30);
        break;
      case '7_DAYS':
        startDate.setDate(now.getDate() - 7);
        break;
      case '90_DAYS':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'LAST_YEAR':
        startDate.setFullYear(now.getFullYear() - 1);
        dateFormatter = (date: Date) =>
          new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
        break;
      default:
        throw new BadRequestException('Invalid filter');
    }

    // Fetch all relevant records
    const scans = await this.prisma.qrCodeController.findMany({
      where: {
        qrCode: { userId },
        createdAt: {
          gte: startDate,
          lte: now,
        },
      },
      select: {
        createdAt: true,
      },
    });

    // Group and count the records manually
    const groupedScans = scans.reduce((acc, scan) => {
      const formattedDate = dateFormatter(scan.createdAt);
      if (!acc[formattedDate]) {
        acc[formattedDate] = 0;
      }
      acc[formattedDate] += 1; // Increment the count for the date
      return acc;
    }, {});

    const formattedScans = Object.entries(groupedScans).map(
      ([date, count]) => ({
        date,
        scans: count,
      }),
    );

    return formattedScans;
  }

  async getTopScannedQrCodes(userId: number) {
    // Fetch the top 20 most scanned active QR codes
    const topQrCodes = await this.prisma.qRCode.findMany({
      where: {
        userId,
        isControlled: true, // Only active QR codes
      },
      include: {
        _count: {
          select: {
            qrCodeControllers: true, // Count of scans
          },
        },
      },
      orderBy: {
        qrCodeControllers: {
          _count: 'desc', // Order by scan count'
        },
      },
      take: 20, // Limit to top 20
    });

    // Format the result
    return topQrCodes.map((qrCode) => ({
      id: qrCode.id,
      name: qrCode.name,
      scanCount: qrCode._count.qrCodeControllers,
    }));
  }
}
