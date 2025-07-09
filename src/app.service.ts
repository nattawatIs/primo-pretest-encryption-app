import { CryptoService } from './crypto/crypto.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DecryptDataDto } from './dto/decrypt-data.dto';
import { EncryptDataDto } from './dto/encrypt-data.dto';

@Injectable()
export class AppService {
  constructor(private readonly cryptoService: CryptoService) {}

  getEncryptedData(dto: EncryptDataDto) {
    try {
      const aesKey = this.cryptoService.generateAESKey();
      const data2 = this.cryptoService.encryptWithAES(dto.payload, aesKey);
      const data1 = this.cryptoService.encryptAESKeyWithPrivateKey(aesKey);

      return {
        successful: true,
        error_code: '',
        data: {
          data1,
          data2,
        },
      };
    } catch (error) {
      throw new BadRequestException({
        successful: false,
        error_code: error.code,
        data: null,
      });
    }
  }

  getDecryptedData(dto: DecryptDataDto) {
    try {
      const aesKeyHex = this.cryptoService.decryptAESKeyWithPublicKey(
        dto.data1,
      );
      const payload = this.cryptoService.decryptWithAES(dto.data2, aesKeyHex);

      return {
        successful: true,
        error_code: '',
        data: {
          payload,
        },
      };
    } catch (error) {
      throw new BadRequestException({
        successful: false,
        error_code: error.code,
        data: null,
      });
    }
  }
}
