import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCoffeeDto {
  @ApiProperty({ description: 'Coffee name' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Coffee brand name' })
  @IsString()
  readonly brand: string;

  @ApiProperty({ example: [] })
  @IsString({ each: true })
  readonly flavors: string[];
}
