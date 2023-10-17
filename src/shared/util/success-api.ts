import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SuccessAPI{

  @ApiProperty()
  statusText:string = "success"

  @ApiProperty()
  result:number = 1

  @ApiProperty()
  code:number = 200
  
  @ApiPropertyOptional()
  id?:number 
}