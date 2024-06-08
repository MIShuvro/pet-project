import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToClass, Transform } from "class-transformer";


export class UserResponseDto {
  @ApiProperty()
  @Expose()
  _id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  email: string;
}

export class UserInternalResponseDto {
  @ApiProperty()
  @Expose()
  _id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  password: string;

  @ApiProperty()
  @Expose()
  group_name: string;

  @ApiProperty()
  @Expose()
  permissions: string[];
}

export interface IAuthorizedAdminUser {
  _id: string;
  name: string;
  email: string;
  group_name: string;
  permissions: string[];
}

export interface IAuthorizedUser {
  _id: string;
  name: string;
  email: string;
  group_name: string;
}
