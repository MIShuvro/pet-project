import { Module } from "@nestjs/common";
import { GroupController } from "./controller/group.controller";
import { PermissionController } from "./controller/permission.controller";
import { GroupService } from "./service/group.service";
import { PermissionService } from "./service/permission.service";
import { UserService } from "./service/user.service";
import { GroupRepository } from "./repository/group.repository";
import { PermissionRepository } from "./repository/permisssion.repository";
import { UserRepository } from "./repository/user.repository";
import { UserMapPermissionRepository } from "./repository/user-map-permission.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { Group, GroupSchema } from "./schema/group.schema";
import { Permission, PermissionSchema } from "./schema/permission.schema";
import { User, UserSchema } from "./schema/user.schema";
import { UserMapPermission, UserMapPermissionSchema } from "./schema/user-map-permission.schema";
import { SessionRepository } from "./repository/session.repository";
import { Session, SessionSchema } from "./schema/session.schema";
import { SessionService } from "./service/session.service";


@Module({
  imports: [

    MongooseModule.forFeatureAsync([
      {
        name: Group.name,
        useFactory: () => {
          const schema = GroupSchema;
          return schema;
        }
      },
      {
        name: Permission.name,
        useFactory: () => {
          const schema = PermissionSchema;
          return schema;
        }
      },
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          return schema;
        }
      },
      {
        name: UserMapPermission.name,
        useFactory: () => {
          const schema = UserMapPermissionSchema;
          return schema;
        }
      },
      {
        name: Session.name,
        useFactory: () => {
          const schema = SessionSchema;
          return schema;
        }
      }

    ])

  ],
  controllers: [GroupController, PermissionController],
  providers: [GroupService, GroupRepository, PermissionService, PermissionRepository, UserService, UserRepository, UserMapPermissionRepository, SessionRepository, SessionService],
  exports: [SessionService, UserService, GroupService, PermissionService]
})
export class UserModule {
}
