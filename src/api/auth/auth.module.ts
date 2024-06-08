import { Module } from '@nestjs/common';
import { UserAuthController } from './controller/user-auth.controller';
import { AuthService } from './service/auth.service';
import { UserModule } from "../user/user.module";


@Module({
  imports: [
    UserModule
  ],
  controllers: [UserAuthController],
  providers: [AuthService]
})
export class AuthModule {
}
