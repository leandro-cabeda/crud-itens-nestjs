import { IsString, IsOptional } from 'class-validator';

export class FilterDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

}