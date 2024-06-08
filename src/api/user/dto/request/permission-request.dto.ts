import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { ADMIN_PERMISSION, PERMISSION_STATUS } from "../../../../common/constants";
import { concatObject } from "../../../../common/utils";


export class PermissionRequestDto {

  @ApiProperty({ description: "Create Quiz" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ default: concatObject(ADMIN_PERMISSION, "||") })
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(ADMIN_PERMISSION))
  identifier: string;

  @ApiProperty({ default: concatObject(PERMISSION_STATUS, "||") })
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(PERMISSION_STATUS))
  status: string;
}
