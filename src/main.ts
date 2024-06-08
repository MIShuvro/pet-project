import { NestFactory } from "@nestjs/core";
import { ApiModule } from "./api/api.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { Logger, RequestMethod, ValidationPipe, VersioningType } from "@nestjs/common";
import { setupSwagger } from "./common/swagger";
import * as process from "process";
import { AppConfigService } from "./common/app-config/service/app-config.service";

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix("api", { exclude: [{ path: "", method: RequestMethod.GET }] });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  );
  app.enableVersioning({
    type: VersioningType.URI
  });
  await setupSwagger(app);
  let port = AppConfigService.appConfig.PORT
  await app.listen(port);
  Logger.log(await app.getUrl(), 'App Url');
}

bootstrap();
