import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "../repository/user.repository";
import { UserRequestDto } from "../dto/request/user-request.dto";
import { IAuthorizedAdminUser, UserInternalResponseDto, UserResponseDto } from "../dto/response/user-response.dto";
import { hashPassword, isMongoDdObjId } from "../../../common/utils";
import { plainToClass } from "class-transformer";
import { GroupService } from "./group.service";
import { GroupRepository } from "../repository/group.repository";
import { GroupDocument } from "../schema/group.schema";
import { PermissionService } from "./permission.service";
import { GROUP_IDENTIFIER } from "../../../common/constants";


@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository, private groupRepository: GroupRepository,
              private permissionService: PermissionService) {
  }


  async createUser(dto: UserRequestDto): Promise<UserResponseDto> {
    let { name, email, group_id, password } = dto;
    let user = await this.userRepository.save({
      name,
      email,
      password: hashPassword(password),
      group_id
    });
    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }

  async findByEmail(email: string): Promise<UserInternalResponseDto> {
    let user = await this.userRepository.findOne({
      email
    });
    let group = await this.groupRepository.findOne({
      _id: user.group_id
    });
    return plainToClass(UserInternalResponseDto, {
      ...user,
      group_name: group.identifier
    }, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }

  async validateUserGroup(group_id: string): Promise<GroupDocument> {
    let isMongoId = isMongoDdObjId(group_id);
    if (!isMongoId) {
      throw new BadRequestException("invalid group id");
    }
    let group = await this.groupRepository.findOne({ _id: group_id });
    if (group.identifier != GROUP_IDENTIFIER.ADMIN) {
      throw new BadRequestException("Group id must be admin type");
    }

    return group;
  }

  async createAdminUser(dto: UserRequestDto): Promise<UserResponseDto> {
    let { name, email, group_id, password } = dto;
    let group = await this.validateUserGroup(group_id);
    if (!group) {
      throw new BadRequestException("invalid group");
    }
    let user = await this.userRepository.save({
      name,
      email,
      password: hashPassword(password),
      group_id
    });
    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }

  async findUserWithPermissions(_id: string): Promise<UserInternalResponseDto> {
    let user = await this.userRepository.findOne({
      _id
    });
    let group = await this.groupRepository.findOne({
      _id: user.group_id
    });
    let permissions = await this.permissionService.findPermissionsByUserId(user._id);
    return plainToClass(UserInternalResponseDto, {
      ...user,
      group_name: group.identifier,
      permissions: permissions
    }, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }

  checkPermission(user: IAuthorizedAdminUser, permissions: string[]): boolean {
    let userPermissions = user.permissions;
    return permissions.every(permission => userPermissions.includes(permission));
  }
}
