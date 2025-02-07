import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import {
  CreateQRCodeDto,
  LogoQRCodeDto,
  UpdateQRCodeDto,
} from './dto/qr-codes.dto';
import { QRCodeService } from './qr-codes.service';

@Controller('qr-codes')
export class QRCodeController {
  constructor(private readonly qrCodeService: QRCodeService) {}

  @Post()
  create(@Body() createQRCodeDto: CreateQRCodeDto, @Req() req: CustomRequest) {
    const userId = Number(req.user.id);
    return this.qrCodeService.create(createQRCodeDto, userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateQRCodeDto: UpdateQRCodeDto) {
    return this.qrCodeService.update(+id, updateQRCodeDto);
  }

  @Patch(':id')
  updatePartial(
    @Param('id') id: string,
    @Body() updateQRCodeDto: UpdateQRCodeDto,
  ) {
    return this.qrCodeService.update(+id, updateQRCodeDto);
  }

  @Delete(':id')
  remove(@Req() req: CustomRequest, @Param('id') id: string) {
    const userId = Number(req.user.id);
    return this.qrCodeService.remove(userId, +id);
  }

  @Get()
  findAll(
    @Req() req: CustomRequest,
    @Query('page') page: number,
    @Query('limit') limit: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('isControlled') isControlled: string,
    @Query('type') type: string,
  ) {
    const userId = Number(req.user.id);
    return this.qrCodeService.findAll(userId, {
      page,
      limit,
      startDate,
      endDate,
      isControlled: isControlled === 'true',
      type,
    });
  }

  @Get(':id')
  findOne(@Req() req: CustomRequest, @Param('id') id: string) {
    const userId = Number(req.user.id);
    return this.qrCodeService.findOne(+userId, +id);
  }

  @Patch(':id/logo')
  async addLogo(
    @Req() req: CustomRequest,
    @Param('id') id: string,
    @Body() body: LogoQRCodeDto,
  ) {
    const userId = Number(req.user.id);
    const qrCodeId = Number(id);
    return this.qrCodeService.addLogo(userId, qrCodeId, body.logoId);
  }

  @Delete(':id/logo/:logoId')
  async removeLogo(
    @Req() req: CustomRequest,
    @Param('id') id: string,
    @Param('logoId') logoId: string,
  ) {
    const userId = Number(req.user.id);
    const qrCodeId = Number(id);
    const logoIdToNumber = Number(logoId);
    return this.qrCodeService.removeLogo({
      userId,
      qrCodeId,
      logoId: logoIdToNumber,
    });
  }
}
