import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../../api/user/service/user.service";
import { IAuthorizedAdminUser, IAuthorizedUser } from "../../api/user/dto/response/user-response.dto";
import { GROUP_IDENTIFIER } from "../constants";
import { AppConfigService } from "../app-config/service/app-config.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private userService: UserService) {
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    let request = context.switchToHttp().getRequest();
    let { authorization } = request.headers;
    if (!authorization) {
      throw new UnauthorizedException(`Authorization  required in header`);
    }
    if (authorization.startsWith("Bearer ")) {
      authorization = authorization.split(" ")[1];
    }
    let user: IAuthorizedUser = null;
    try {
      let payload = this.jwtService.verify(authorization, { ignoreExpiration: false, secret: AppConfigService.appConfig.APP_USER_SECRET });
      user = await this.userService.findUserWithPermissions(payload.subscriber);
    } catch (error) {
      context.switchToHttp().getRequest().isError = true;
      return false;
    }
    request.user = user;
    return true;
  }
}
