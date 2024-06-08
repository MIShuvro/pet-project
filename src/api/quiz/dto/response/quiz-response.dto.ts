import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToInstance, Transform } from "class-transformer";

export class QuizOptionResponse {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  _id: string;
}

export class QuizResponseDto {

  @ApiProperty()
  @Expose()
  _id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty({ type: [QuizOptionResponse] })
  @Expose()
  @Transform(value => {
    return plainToInstance(QuizOptionResponse, value.obj.options, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    });
  })
  options: QuizOptionResponse[];
}

export class QuizResultMetric {
  @ApiProperty()
  @Expose()
  _id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  total_submissions: number;

  @ApiProperty()
  @Expose()
  total_wrong_submissions: number;

  @ApiProperty()
  @Expose()
  total_correct_submissions: number;

  @ApiProperty()
  @Expose()
  percentage_of_wrong_submissions: number;

  @ApiProperty()
  @Expose()
  percentage_of_correct_submissions: number;
}
