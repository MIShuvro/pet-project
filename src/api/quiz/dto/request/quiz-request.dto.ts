import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsDate, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { PERMISSION_STATUS } from "../../../../common/constants";
import e from "express";


export class QuizOption {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Boolean)
  is_correct: boolean;
}

export class QuizRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ default: "active" })
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(PERMISSION_STATUS))
  status: string;

  @ApiProperty({ type: [QuizOption] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizOption)
  options: QuizOption[];
}

export class QuizSubmissionRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  quiz_id: string;


  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  option_id: string;
}

export class QuizResultQueryRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  range_start_at: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  range_end_at: Date;
}
