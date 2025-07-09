import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EncryptDataDto } from './dto/encrypt-data.dto';
import { DecryptDataDto } from './dto/decrypt-data.dto';

describe('AppController (Unit Test)', () => {
  let controller: AppController;
  let appService: jest.Mocked<AppService>;

  beforeEach(async () => {
    const mockAppService: Partial<jest.Mocked<AppService>> = {
      getEncryptedData: jest.fn(),
      getDecryptedData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: mockAppService }],
    }).compile();

    controller = module.get<AppController>(AppController);
    appService = module.get(AppService) as jest.Mocked<AppService>;
  });

  describe('POST /get-encrypt-data', () => {
    it('should return encrypted data from service', () => {
      const dto: EncryptDataDto = { payload: 'test123' };

      const mockResponse = {
        successful: true,
        error_code: '',
        data: {
          data1: 'mockedData1',
          data2: 'mockedData2',
        },
      };

      appService.getEncryptedData.mockReturnValue(mockResponse);

      const result = controller.getEncryptData(dto);
      expect(result).toEqual(mockResponse);
      expect(appService.getEncryptedData).toHaveBeenCalledWith(dto);
    });
  });

  describe('POST /get-decrypt-data', () => {
    it('should return decrypted data from service', () => {
      const dto: DecryptDataDto = {
        data1: 'encryptedKey',
        data2: 'encryptedPayload',
      };

      const mockResponse = {
        successful: true,
        error_code: '',
        data: {
          payload: 'originalMessage',
        },
      };

      appService.getDecryptedData.mockReturnValue(mockResponse);

      const result = controller.getDecryptData(dto);
      expect(result).toEqual(mockResponse);
      expect(appService.getDecryptedData).toHaveBeenCalledWith(dto);
    });
  });
});
