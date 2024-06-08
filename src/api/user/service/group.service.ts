import { Injectable } from "@nestjs/common";
import { GroupRepository } from "../repository/group.repository";
import { GroupRequestDto } from "../dto/request/group-request.dto";
import { GroupResponseDto } from "../dto/response/group-response.dto";
import { plainToClass, plainToInstance } from "class-transformer";
import { GROUP_IDENTIFIER } from "../../../common/constants";


@Injectable()
export class GroupService {
  constructor(private groupRepository: GroupRepository) {
  }

  async createGroup(dto: GroupRequestDto): Promise<GroupResponseDto> {
    let { name, identifier } = dto;
    let group = await this.groupRepository.save({
      name,
      identifier
    });
    return plainToClass(GroupResponseDto, group, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }

  async findGroup(): Promise<GroupResponseDto[]> {
    let groups = await this.groupRepository.find({});
    return plainToInstance(GroupResponseDto, groups, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }

  async findOrCreateUserGroup(): Promise<GroupResponseDto> {
    let userGroup = await this.groupRepository.findOne({
      identifier: GROUP_IDENTIFIER.USER
    });
    if (!userGroup) {
      return await this.createGroup({ name: "USER", identifier: GROUP_IDENTIFIER.USER });
    }

    return plainToInstance(GroupResponseDto, userGroup, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }
}
