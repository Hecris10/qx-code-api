import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import {
  CreateQrCodeControllerDto,
  UpdateQrCodeControllerDto,
} from './dto/qr-code-controller.dto';
import { QrCodeControllerService } from './qr-code-controller.service';

@Controller('qr-code-controller')
export class QrCodeControllerController {
  constructor(
    private readonly qrCodeControllerService: QrCodeControllerService,
  ) {}

  @Post()
  async create(@Body() createQrControllerDto: CreateQrCodeControllerDto) {
    return this.qrCodeControllerService.create(createQrControllerDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQrControllerDto: UpdateQrCodeControllerDto,
    @Req() req: CustomRequest,
  ) {
    const userId = Number(req.user.id);
    return this.qrCodeControllerService.update(
      userId,
      +id,
      updateQrControllerDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: CustomRequest) {
    const userId = Number(req.user.id);
    return this.qrCodeControllerService.remove(userId, +id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: CustomRequest) {
    const userId = Number(req.user.id);
    return this.qrCodeControllerService.findOne(userId, +id);
  }

  @Get()
  async findAll(@Req() req: CustomRequest) {
    const userId = Number(req.user.id);
    return this.qrCodeControllerService.findAll(userId);
  }
}
