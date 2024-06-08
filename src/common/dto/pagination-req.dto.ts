import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationReqDto {
  @ApiPropertyOptional({ default: 1 })
  @Type((number) => Number)
  @IsOptional()
  page: number;

  @ApiPropertyOptional({ default: 20 })
  @Type((number) => Number)
  @IsOptional()
  limit: number;
}
