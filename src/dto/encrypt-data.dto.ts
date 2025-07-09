import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class EncryptDataDto {
  @ApiProperty({ description: 'Payload string to encrypt', maxLength: 2000 })
  @IsString()
  @MinLength(0)
  @MaxLength(2000)
  payload: string;
}
