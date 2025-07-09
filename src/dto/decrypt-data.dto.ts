import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DecryptDataDto {
  @ApiProperty({ description: 'Encrypted string part 1' })
  @IsString()
  data1: string;

  @ApiProperty({ description: 'Encrypted string part 2' })
  @IsString()
  data2: string;
}
