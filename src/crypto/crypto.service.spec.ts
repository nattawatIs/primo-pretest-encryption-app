import { CryptoService } from './crypto.service';
import * as crypto from 'crypto';

describe('CryptoService (Unit Test)', () => {
  let service: CryptoService;

  const mockPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICWQIBAAKBgFeQb6OSkBbuNH8ohg6VCr269VG2YmoNTiHf4eMbnbcLuK0fi88b
9dO+X4JzegJ8YMVVpKZ1vxiX9mLNCewbzUpfo29EnohDhpd9eB4KwKHrosHY6XA8
rD5/lz2QV3U2nLmPtj4RLupeEEpoOf6OjG1usmlZBs31hp7OxSFi0s3vAgMBAAEC
gYBPCS3bROUN7YAw7lDiRKDnVCMt2CPIea32YXAwX7Lhj5Dnoru8+w3OS91FkBmm
uMFYHM96+Hi+KBvaXhwAo6+Ny5SmL/7BmQuejLSVqt9KFH0Y9yeEJgu3rhvzSoOr
yXVUDuNiCArbii+8m8mS/7wXMMlS25hNWoSnRPVlwFHHsQJBAKmkNkXuAPHKhr8r
/lIuYutaO8reaGCFeS0RJlgiRUHjxldVfiXVa3jrp7kPYzvD4pt3HTFv9nwFIPz7
BGMpZBsCQQCEI9yhbrcC4P/oQPK9yUx+7HM8quGUQq+Avr4i7b6b4zUsWXDJJfsP
gXGRKoaCm7ZMGglSkRldTEU/6LCMThK9AkBeYu+PmQ0NexHd7CxkrUp8iIgcKAML
MThqys/62ZaPQpxomzjE9CoH7ZY0cUtVRXgf5/ZmO1V5S6E/IKsgQTdhAj88ZCdx
oCgEKNDMVOKb2mQbnfUMxQxTtiZ/sK01SXLTzAOBQV9KjxEvBPniXo0bJA8suLmK
AsaU3UbI7o/Bj+0CQD9rBcQID8c4w/QUXsdWCHVMym8GfwyVPNc1+GkHU22Oxeag
CXk7U0CJEDjMhGb0c3tIcHjz7iZVGl0wuaYCPvk=
-----END RSA PRIVATE KEY-----`;

  const mockPublicKey = `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgFeQb6OSkBbuNH8ohg6VCr269VG2
YmoNTiHf4eMbnbcLuK0fi88b9dO+X4JzegJ8YMVVpKZ1vxiX9mLNCewbzUpfo29E
nohDhpd9eB4KwKHrosHY6XA8rD5/lz2QV3U2nLmPtj4RLupeEEpoOf6OjG1usmlZ
Bs31hp7OxSFi0s3vAgMBAAE=
-----END PUBLIC KEY-----`;

  beforeEach(() => {
    service = new CryptoService();

    (service as any).privateKey = mockPrivateKey;
    (service as any).publicKey = mockPublicKey;
  });

  it('should generate AES key (64 hex chars)', () => {
    const key = service.generateAESKey();
    expect(typeof key).toBe('string');
    expect(key.length).toBe(64); // 32 bytes = 64 hex chars
  });

  it('should encrypt and decrypt with AES correctly', () => {
    const key = service.generateAESKey();
    const text = 'hello-world';
    const encrypted = service.encryptWithAES(text, key);
    const decrypted = service.decryptWithAES(encrypted, key);

    expect(decrypted).toBe(text);
  });

  it('should encrypt and decrypt AES key with RSA correctly', () => {
    const aesKey = service.generateAESKey();
    const encryptedKey = service.encryptAESKeyWithPrivateKey(aesKey);
    const decryptedKey = service.decryptAESKeyWithPublicKey(encryptedKey);

    expect(decryptedKey).toBe(aesKey);
  });

  it('should throw error if decrypting with wrong key', () => {
    const aesKey = service.generateAESKey();
    const encrypted = service.encryptAESKeyWithPrivateKey(aesKey);

    (service as any).publicKey = crypto
      .generateKeyPairSync('rsa', {
        modulusLength: 1024,
      })
      .publicKey.export({ type: 'pkcs1', format: 'pem' });

    expect(() => {
      service.decryptAESKeyWithPublicKey(encrypted);
    }).toThrow();
  });
});
