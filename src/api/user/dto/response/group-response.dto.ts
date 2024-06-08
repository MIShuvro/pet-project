import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";


export class GroupResponseDto {
  @ApiProperty()
  @Expose()
  _id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  identifier: string;
}
