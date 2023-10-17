import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductTypeDto {
  
  @ApiProperty()
  @IsNotEmpty()
  type_name: string;
  
  @ApiPropertyOptional()
  img_url: string;

}

