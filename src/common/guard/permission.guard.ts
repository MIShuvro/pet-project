import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  mixin,
  Type,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../../api/user/service/user.service";
import { IAuthorizedAdminUser } from "../../api/user/dto/response/user-response.dto";
import { GROUP_IDENTIFIER } from "../constants";
import { AppConfigService } from "../app-config/service/app-config.service";


const PermissionGuard = (permissions: string[]): Type<CanActivate> => {
  @Injectable()
  class PermissionGuardMixin implements CanActivate {
    constructor(private jwtService: JwtService, private userService: UserService) {
    }

    async canActivate(context: ExecutionContext) {
      let request = context.switchToHttp().getRequest();
      let { authorization } = request.headers;
      if (!authorization) {
        throw new UnauthorizedException(`Authorization  required in header`);
      }

      if (authorization.startsWith("Bearer ")) {
        authorization = authorization.split(" ")[1];
      }
      let user: IAuthorizedAdminUser = null;
      try {
        let payload = this.jwtService.verify(authorization, {
          ignoreExpiration: false,
          secret: AppConfigService.appConfig.APP_ADMIN_SECRET
        });
        user = await this.userService.findUserWithPermissions(payload.subscriber);
      } catch (error) {
        context.switchToHttp().getRequest().isError = true;
        return false;
      }

      if (permissions.length > 0) {
        let has_permission = this.userService.checkPermission(user, permissions);
        if (!has_permission) {
          throw new ForbiddenException(`not enough permission needed this ${permissions.toString()} permissions`);
        }
      }
      request.user = user;
      return true;
    }
  }

  return mixin(PermissionGuardMixin);
};

export default PermissionGuard;
