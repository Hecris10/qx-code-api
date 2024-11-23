import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';

import { CustomRequest } from '../interfaces/custom-request.interface';
import { CreateQRCodeDto } from './dto/create-qr-code.dto';
import { UpdateQRCodeDto } from './dto/update-qr-code.dto';
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qrCodeService.remove(+id);
  }

  @Get()
  findAll(
    @Req() req: CustomRequest,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const userId = Number(req.user.id);
    return this.qrCodeService.findAll(userId, {
      page,
      limit,
      startDate,
      endDate,
    });
  }
}
