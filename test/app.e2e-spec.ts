import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // โหลดทั้ง module จริง
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe()); // สำหรับ DTO validation
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let encryptedResult: { data1: string; data2: string };

  describe('/get-encrypt-data', () => {
    it('should return encrypted data', async () => {
      const payload = { payload: 'hello world' };

      const res = await request(app.getHttpServer())
        .post('/get-encrypt-data')
        .send(payload)
        .expect(201);

      expect(res.body.successful).toBe(true);
      expect(res.body.data.data1).toBeDefined();
      expect(res.body.data.data2).toBeDefined();

      encryptedResult = res.body.data;
    });

    it('should return 400 if payload exceeds 2000 characters', async () => {
      const longPayload = 'a'.repeat(2001);

      const res = await request(app.getHttpServer())
        .post('/get-encrypt-data')
        .send({ payload: longPayload })
        .expect(400);

      expect(res.body.message).toContain(
        'payload must be shorter than or equal to 2000 characters',
      );
    });
  });

  describe('/get-decrypt-data', () => {
    it('should return decrypted data', async () => {
      const res = await request(app.getHttpServer())
        .post('/get-decrypt-data')
        .send({
          data1: encryptedResult.data1,
          data2: encryptedResult.data2,
        })
        .expect(201);

      expect(res.body.successful).toBe(true);
      expect(res.body.data.payload).toBe('hello world');
    });

    it('should return 400 if data1/data2 is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/get-decrypt-data')
        .send({
          data1: 'invalid-base64!!!',
          data2: 'wrong-data',
        })
        .expect(400);

      expect(res.body.successful).toBe(false);
      expect(res.body.error_code).toBeDefined();
    });
  });
});
