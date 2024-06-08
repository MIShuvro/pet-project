import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { GROUP_IDENTIFIER, PERMISSION_STATUS } from "../../../../common/constants";
import { concatObject } from "../../../../common/utils";


export class GroupRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ default: concatObject(PERMISSION_STATUS, "||") })
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(GROUP_IDENTIFIER))
  identifier: string;
}
