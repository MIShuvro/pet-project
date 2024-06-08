import {
  Body,
  Controller,
  HttpStatus,
  Injectable,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ResponseInterceptor } from "../../../common/interceptors/response.interceptor";
import { LoginRequestDto } from "../dto/request/login-request.dto";
import { LoginResponseDto } from "../dto/response/login-response.dto";
import { BaseApiResponse, SwaggerBaseApiResponse } from "../../../common/dto/base-api-response.dto";
import { AuthService } from "../service/auth.service";
import { SignUpRequestDto } from "../dto/request/sign-up-request.dto";
import { UserResponseDto } from "../../user/dto/response/user-response.dto";
import { UserRequestDto } from "../../user/dto/request/user-request.dto";

@ApiTags("Auth")
@Injectable()
@UseInterceptors(ResponseInterceptor)
@Controller({ version: "1", path: "auth" })
export class UserAuthController {
  constructor(private authService: AuthService) {
  }

  @Post("login")
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ type: SwaggerBaseApiResponse(LoginResponseDto, HttpStatus.OK) })
  async login(@Body() data: LoginRequestDto): Promise<BaseApiResponse<LoginResponseDto>> {
    let res = await this.authService.login(data);
    return {
      message: "OK",
      data: res
    };
  }

  @Post("user/sign-up")
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ type: SwaggerBaseApiResponse(UserResponseDto, HttpStatus.OK) })
  async signup(@Body() dto: SignUpRequestDto): Promise<BaseApiResponse<UserResponseDto>> {
    let data = await this.authService.signup(dto);
    return {
      message: "OK",
      data
    };
  }

  @Post("admin/sign-up")
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ type: SwaggerBaseApiResponse(UserResponseDto, HttpStatus.OK) })
  async adminSignup(@Body() dto: UserRequestDto): Promise<BaseApiResponse<UserResponseDto>> {
    let data = await this.authService.adminSignup(dto);
    return {
      message: "OK",
      data
    };
  }
}
