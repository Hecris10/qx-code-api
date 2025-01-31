import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateQrCodeControllerDto,
  UpdateQrCodeControllerDto,
} from './dto/qr-code-controller.dto';

@Injectable()
export class QrCodeControllerService {
  constructor(private prisma: PrismaService) {}

  async create(createQrCodeControllerDto: CreateQrCodeControllerDto) {
    // Check if the qrCodeId exists in the QRCode table
    const qrCodeExists = await this.prisma.qRCode.findUnique({
      where: { id: createQrCodeControllerDto.qrCodeId },
    });

    if (!qrCodeExists) {
      throw new NotFoundException(
        `QR code with id ${createQrCodeControllerDto.qrCodeId} not found`,
      );
    }

    try {
      const newQrCodeController = await this.prisma.qrCodeController.create({
        data: {
          ...createQrCodeControllerDto,
        },
        include: { qrCode: true },
      });

      return { link: newQrCodeController.qrCode.link };
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Failed to create QR code controller: ${error.message}`,
      );
    }
  }

  async findOne(userId: number, id: number) {
    const qrCodeController = await this.prisma.qrCodeController.findFirst({
      where: { id, qrCode: { userId } },
    });

    if (!qrCodeController) {
      throw new NotFoundException(`QR code controller not found`);
    }

    return qrCodeController;
  }

  async findAll(userId: number) {
    return await this.prisma.qrCodeController.findMany({
      where: { qrCode: { userId } },
    });
  }

  async update(
    userId: number,
    id: number,
    updateQrCodeControllerDto: UpdateQrCodeControllerDto,
  ) {
    const qrCodeController = await this.prisma.qrCodeController.findFirst({
      where: { id, qrCode: { userId } },
    });

    if (!qrCodeController) {
      throw new NotFoundException(`QR code controller not found`);
    }

    try {
      return await this.prisma.qrCodeController.update({
        where: { id },
        data: updateQrCodeControllerDto,
      });
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Failed to update QR code controller: ${error.message}`,
      );
    }
  }

  async remove(userId: number, id: number) {
    const qrCodeController = await this.prisma.qrCodeController.findFirst({
      where: { id, qrCode: { userId } },
    });

    if (!qrCodeController) {
      throw new NotFoundException(`QR code controller not found`);
    }

    try {
      await this.prisma.qrCodeController.delete({
        where: { id },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Failed to delete QR code controller: ${error.message}`,
      );
    }
  }
}
