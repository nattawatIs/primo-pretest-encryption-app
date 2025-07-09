import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { CryptoService } from './crypto/crypto.service';
import { BadRequestException } from '@nestjs/common';
import { EncryptDataDto } from './dto/encrypt-data.dto';
import { DecryptDataDto } from './dto/decrypt-data.dto';

describe('AppService (Unit Test)', () => {
  let appService: AppService;
  let cryptoService: jest.Mocked<CryptoService>;

  beforeEach(async () => {
    const mockCryptoService = {
      generateAESKey: jest.fn(),
      encryptWithAES: jest.fn(),
      encryptAESKeyWithPrivateKey: jest.fn(),
      decryptAESKeyWithPublicKey: jest.fn(),
      decryptWithAES: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: CryptoService, useValue: mockCryptoService },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    cryptoService = module.get(CryptoService) as jest.Mocked<CryptoService>;
  });

  describe('getEncryptedData()', () => {
    it('should return encrypted data correctly', () => {
      const dto: EncryptDataDto = { payload: 'hello world' };

      cryptoService.generateAESKey.mockReturnValue('mockedAESKey');
      cryptoService.encryptWithAES.mockReturnValue('mockedEncryptedData2');
      cryptoService.encryptAESKeyWithPrivateKey.mockReturnValue(
        'mockedEncryptedData1',
      );

      const result = appService.getEncryptedData(dto);

      expect(result).toEqual({
        successful: true,
        error_code: '',
        data: {
          data1: 'mockedEncryptedData1',
          data2: 'mockedEncryptedData2',
        },
      });

      expect(cryptoService.generateAESKey).toHaveBeenCalled();
      expect(cryptoService.encryptWithAES).toHaveBeenCalledWith(
        'hello world',
        'mockedAESKey',
      );
      expect(cryptoService.encryptAESKeyWithPrivateKey).toHaveBeenCalledWith(
        'mockedAESKey',
      );
    });

    it('should throw BadRequestException if an error occurs', () => {
      cryptoService.generateAESKey.mockImplementation(() => {
        throw { code: 'KEY_GEN_ERROR' };
      });

      const dto: EncryptDataDto = { payload: 'test' };

      try {
        appService.getEncryptedData(dto);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.getResponse()).toEqual({
          successful: false,
          error_code: 'KEY_GEN_ERROR',
          data: null,
        });
      }
    });
  });

  describe('getDecryptedData()', () => {
    it('should return decrypted payload correctly', () => {
      const dto: DecryptDataDto = {
        data1: 'encryptedKeyBase64',
        data2: 'encryptedPayloadBase64',
      };

      cryptoService.decryptAESKeyWithPublicKey.mockReturnValue('mockedAESKey');
      cryptoService.decryptWithAES.mockReturnValue('originalPayload');

      const result = appService.getDecryptedData(dto);

      expect(result).toEqual({
        successful: true,
        error_code: '',
        data: {
          payload: 'originalPayload',
        },
      });

      expect(cryptoService.decryptAESKeyWithPublicKey).toHaveBeenCalledWith(
        'encryptedKeyBase64',
      );
      expect(cryptoService.decryptWithAES).toHaveBeenCalledWith(
        'encryptedPayloadBase64',
        'mockedAESKey',
      );
    });

    it('should throw BadRequestException if decryption fails', () => {
      cryptoService.decryptAESKeyWithPublicKey.mockImplementation(() => {
        throw { code: 'DECRYPT_ERROR' };
      });

      const dto: DecryptDataDto = {
        data1: 'invalidKey',
        data2: 'invalidPayload',
      };

      try {
        appService.getDecryptedData(dto);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.getResponse()).toEqual({
          successful: false,
          error_code: 'DECRYPT_ERROR',
          data: null,
        });
      }
    });
  });
});
