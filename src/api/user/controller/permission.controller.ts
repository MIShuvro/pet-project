import { ApiCreatedResponse, ApiOkResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Injectable,
  Post,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { ResponseInterceptor } from "../../../common/interceptors/response.interceptor";
import { GroupService } from "../service/group.service";
import { BaseApiResponse, SwaggerBaseApiResponse } from "../../../common/dto/base-api-response.dto";
import { GroupRequestDto } from "../dto/request/group-request.dto";
import { GroupResponseDto } from "../dto/response/group-response.dto";
import { PermissionService } from "../service/permission.service";
import { PermissionRequestDto } from "../dto/request/permission-request.dto";
import { PermissionResponseDto } from "../dto/response/permission-response.dto";
import { MapPermissionRequestDto } from "../dto/request/assign-permission-request.dto";
import PermissionGuard from "../../../common/guard/permission.guard";
import { ADMIN_PERMISSION } from "../../../common/constants";


@ApiTags("Permission")
@Injectable()
@UseInterceptors(ResponseInterceptor)
@Controller({
  version: "1",
  path: "permissions"
})
export class PermissionController {

  constructor(private permissionService: PermissionService) {
  }


  @Post()
  @UseGuards(PermissionGuard([]))
  @ApiSecurity("admin-auth")
  @ApiCreatedResponse({ type: SwaggerBaseApiResponse(PermissionResponseDto, HttpStatus.CREATED) })
  async createPermission(@Body() dto: PermissionRequestDto): Promise<BaseApiResponse<PermissionResponseDto>> {
    let data = await this.permissionService.createPermission(dto);
    return {
      data,
      message: "CREATED"
    };
  }

  @Get()
  @UseGuards(PermissionGuard([]))
  @ApiSecurity("admin-auth")
  @ApiOkResponse({ type: SwaggerBaseApiResponse([PermissionResponseDto], HttpStatus.OK) })
  async findPermission(): Promise<BaseApiResponse<PermissionResponseDto[]>> {
    let data = await this.permissionService.findPermission();
    return {
      data,
      message: "OK"
    };
  }

  @Post("assign")
  @UseGuards(PermissionGuard([]))
  @ApiSecurity("admin-auth")
  @ApiOkResponse({ type: SwaggerBaseApiResponse(String, HttpStatus.OK) })
  async assignPermission(@Body() dto: MapPermissionRequestDto): Promise<BaseApiResponse<String>> {
    await this.permissionService.assignPermission(dto);
    return {
      message: "OK",
      data: null
    };
  }

  @Delete("un-assign")
  @UseGuards(PermissionGuard([]))
  @ApiSecurity("admin-auth")
  @ApiOkResponse({ type: SwaggerBaseApiResponse(String, HttpStatus.OK) })
  async unAssignPermission(@Body() dto: MapPermissionRequestDto): Promise<BaseApiResponse<String>> {
    await this.permissionService.unAssignPermission(dto);
    return {
      message: "OK",
      data: null
    };
  }
}
