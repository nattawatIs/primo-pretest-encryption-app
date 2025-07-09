import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private privateKey: string;
  private publicKey: string;

  constructor() {
    this.privateKey = fs.readFileSync(
      path.join(__dirname, '../../keys/private.pem'),
      'utf-8',
    );
    this.publicKey = fs.readFileSync(
      path.join(__dirname, '../../keys/public.pem'),
      'utf-8',
    );
  }

  generateAESKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  encryptWithAES(payload: string, keyHex: string): string {
    const key = Buffer.from(keyHex, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    let encrypted = cipher.update(payload, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const result = Buffer.concat([iv, Buffer.from(encrypted, 'base64')]);

    return result.toString('base64');
  }

  encryptAESKeyWithPrivateKey(aesKey: string): string {
    return crypto
      .privateEncrypt(
        {
          key: this.privateKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(aesKey, 'hex'),
      )
      .toString('base64');
  }

  decryptAESKeyWithPublicKey(encryptedKeyBase64: string): string {
    const encryptedKey = Buffer.from(encryptedKeyBase64, 'base64');
    const decrypt = crypto.publicDecrypt(
      {
        key: this.publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      encryptedKey,
    );
    return decrypt.toString('hex');
  }

  decryptWithAES(encryptedBase64: string, keyHex: string): string {
    const data = Buffer.from(encryptedBase64, 'base64');

    const iv = data.subarray(0, 16);
    const ciphertext = data.subarray(16);

    const key = Buffer.from(keyHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    let decrypted = decipher.update(ciphertext, undefined, 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
  }
}
