import { ApiCreatedResponse, ApiOkResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, HttpStatus, Injectable, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { ResponseInterceptor } from "../../../common/interceptors/response.interceptor";
import { GroupService } from "../service/group.service";
import { BaseApiResponse, SwaggerBaseApiResponse } from "../../../common/dto/base-api-response.dto";
import { GroupRequestDto } from "../dto/request/group-request.dto";
import { GroupResponseDto } from "../dto/response/group-response.dto";
import PermissionGuard from "../../../common/guard/permission.guard";
import { ADMIN_PERMISSION } from "../../../common/constants";


@ApiTags("Group(Roles)")
@Injectable()
@UseInterceptors(ResponseInterceptor)
@Controller({
  version: "1",
  path: "groups"
})
export class GroupController {

  constructor(private groupService: GroupService) {
  }

  @Post()
  @UseGuards(PermissionGuard([]))
  @ApiSecurity("admin-auth")
  @ApiCreatedResponse({ type: SwaggerBaseApiResponse(GroupResponseDto, HttpStatus.CREATED) })
  async createGroup(@Body() dto: GroupRequestDto): Promise<BaseApiResponse<GroupResponseDto>> {
    let data = await this.groupService.createGroup(dto);
    return {
      data,
      message: "CREATED"
    };
  }

  @Get()
  @UseGuards(PermissionGuard([]))
  @ApiSecurity("admin-auth")
  @ApiOkResponse({ type: SwaggerBaseApiResponse([GroupResponseDto], HttpStatus.OK) })
  async findGroup(): Promise<BaseApiResponse<GroupResponseDto[]>> {
    let data = await this.groupService.findGroup();
    return {
      data,
      message: "OK"
    };
  }

}
