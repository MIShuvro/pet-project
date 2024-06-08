import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class MapPermissionRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNotEmpty()
  permission_id: string;
}
