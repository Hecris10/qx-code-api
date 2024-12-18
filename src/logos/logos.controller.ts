import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { UpoadLogoDto } from './dto/upload-logo.dto';
import { LogosService } from './logos.service';

@Controller('logos')
export class LogosController {
  constructor(private readonly logoService: LogosService) {}

  @Post()
  create(@Body() uploadLogoDto: UpoadLogoDto, @Req() req: CustomRequest) {
    const userId = Number(req.user.id);
    return this.logoService.create(
      userId,
      uploadLogoDto.fileName,
      uploadLogoDto.urlFile,
    );
  }

  @Delete(':id')
  remove(@Req() req: CustomRequest, @Param('id') id: string) {
    const userId = Number(req.user.id);
    return this.logoService.delete(userId, +id);
  }

  @Get()
  findAll(@Req() req: CustomRequest) {
    const userId = Number(req.user.id);
    return this.logoService.findAllByUser(userId);
  }
}
