import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { SignUpRequestDto } from "../dto/request/sign-up-request.dto";
import { GroupService } from "../../user/service/group.service";
import { UserService } from "../../user/service/user.service";
import { UserResponseDto } from "../../user/dto/response/user-response.dto";
import { LoginResponseDto } from "../dto/response/login-response.dto";
import { LoginRequestDto } from "../dto/request/login-request.dto";
import { comparePassword } from "../../../common/utils";
import { SessionService } from "../../user/service/session.service";
import { SessionDocument } from "../../user/schema/session.schema";
import { plainToInstance } from "class-transformer";
import { UserRequestDto } from "../../user/dto/request/user-request.dto";
import { PermissionService } from "../../user/service/permission.service";

@Injectable()
export class AuthService {

  constructor(private groupService: GroupService, private userService: UserService,
              private sessionService: SessionService, private permissionService: PermissionService) {
  }

  async login(body: LoginRequestDto): Promise<LoginResponseDto> {
    let user = await this.userService.findByEmail(body.email);
    if (!user) {
      throw new UnauthorizedException("unauthorized");
    }
    const matchPassword = await comparePassword(user.password, body.password);
    if (!matchPassword) throw new UnauthorizedException();
    let session: SessionDocument = await this.sessionService.findSession(user._id, user.group_name);
    return plainToInstance(LoginResponseDto, session, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }

  async signup(dto: SignUpRequestDto): Promise<UserResponseDto> {
    let { name, email, password } = dto;
    let userGroup = await this.groupService.findOrCreateUserGroup();
    let user = await this.userService.createUser({
      name,
      email,
      password,
      group_id: userGroup._id
    });
    return user;

  }

  async adminSignup(dto: UserRequestDto): Promise<UserResponseDto> {
    let user = await this.userService.createAdminUser(dto);
    return user;
  }
}
