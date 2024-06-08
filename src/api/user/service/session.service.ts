import { Injectable } from "@nestjs/common";
import { SessionRepository } from "../repository/session.repository";
import { JwtService } from "@nestjs/jwt";
import { SessionDocument } from "../schema/session.schema";
import { jwtPayload } from "../../../common/utils";
import { AppConfigService } from "../../../common/app-config/service/app-config.service";
import { GROUP_IDENTIFIER } from "../../../common/constants";

@Injectable()
export class SessionService {

  constructor(private sessionRepository: SessionRepository, private readonly jwtService: JwtService) {
  }

  async getSession(subscriber: string): Promise<SessionDocument> {
    return this.sessionRepository.findOne({
      subscriber
    });
  }

  async findSession(subscriber: string, group_name: string): Promise<SessionDocument> {
    let session = await this.getSession(subscriber);
    if (!session) {
      session = await this.createSession(subscriber, group_name);

    }
    return session;
  }


  async createSession(subscriber: string, group_name): Promise<SessionDocument> {
    const token = await this.generateToken(subscriber, group_name);
    const data = { subscriber, token, group_name };
    return this.sessionRepository.save(data);
  }

  async generateToken(subscriber: string, group: string): Promise<string> {
    let appSecret = AppConfigService.appConfig.APP_USER_SECRET;
    if (group === GROUP_IDENTIFIER.ADMIN) {
      appSecret = AppConfigService.appConfig.APP_ADMIN_SECRET;
    }
    const payload: jwtPayload = {
      subscriber
    };
    return this.jwtService.signAsync(payload, { expiresIn: "24h", secret: appSecret });
  }


}
