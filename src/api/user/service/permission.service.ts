import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PermissionRepository } from "../repository/permisssion.repository";
import { PermissionResponseDto } from "../dto/response/permission-response.dto";
import { PermissionRequestDto } from "../dto/request/permission-request.dto";
import { plainToInstance } from "class-transformer";
import { MapPermissionRequestDto } from "../dto/request/assign-permission-request.dto";
import { UserRepository } from "../repository/user.repository";
import { UserMapPermissionRepository } from "../repository/user-map-permission.repository";


@Injectable()
export class PermissionService {
  constructor(private permissionRepository: PermissionRepository,
              private userRepository: UserRepository,
              private userMapPermissionRepository: UserMapPermissionRepository) {
  }

  async createPermission(dto: PermissionRequestDto): Promise<PermissionResponseDto> {
    let { name, identifier, status } = dto;
    let permission = await this.permissionRepository.save({
      name,
      identifier,
      status
    });
    return plainToInstance(PermissionResponseDto, permission, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }

  async findPermission(): Promise<PermissionResponseDto[]> {
    let permissions = await this.permissionRepository.find({});
    return plainToInstance(PermissionResponseDto, permissions, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }

  async findOnePermissionById(id: string): Promise<PermissionResponseDto> {
    let permission = await this.permissionRepository.findOne({ _id: id });
    return plainToInstance(PermissionResponseDto, permission, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }
  async assignPermission(dto: MapPermissionRequestDto): Promise<String> {
    let { user_id, permission_id } = dto;
    let permission = await this.findOnePermissionById(permission_id);
    if (!permission) {
      throw new BadRequestException("invalid permission");
    }
    let user = await this.userRepository.findOne({
      _id: user_id
    });

    if (!user) {
      throw new BadRequestException("invalid user id");
    }

    await this.userMapPermissionRepository.save({
      permission: permission.identifier,
      permission_id: permission_id,
      user_id
    });
    return "SUCCESS";
  }

  async unAssignPermission(dto: MapPermissionRequestDto): Promise<String> {
    let { user_id, permission_id } = dto;

    let mapPermission = await this.userMapPermissionRepository.findOne({
      user_id,
      permission_id
    });
    if (!mapPermission) {
      throw new NotFoundException("not found");
    }

    await this.userMapPermissionRepository.deleteOne({ _id: mapPermission._id });
    return "SUCCESS";
  }

  async findPermissionsByUserId(id: string): Promise<string[]> {
    let permissions = await this.userMapPermissionRepository.find({
      user_id: id
    });
    return permissions.map((permission) => permission.permission);
  }
}
