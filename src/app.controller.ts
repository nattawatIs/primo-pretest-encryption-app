import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EncryptDataDto } from './dto/encrypt-data.dto';
import { DecryptDataDto } from './dto/decrypt-data.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/get-encrypt-data')
  getEncryptData(@Body() dto: EncryptDataDto) {
    return this.appService.getEncryptedData(dto);
  }

  @Post('/get-decrypt-data')
  getDecryptData(@Body() dto: DecryptDataDto) {
    return this.appService.getDecryptedData(dto);
  }
}
