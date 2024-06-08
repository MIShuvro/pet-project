import { NestFactory } from "@nestjs/core";
import { ApiModule } from "./api/api.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { Logger, RequestMethod, ValidationPipe, VersioningType } from "@nestjs/common";
import { setupSwagger } from "./common/swagger";

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
  await app.listen(3000,"0.0.0.0");
  Logger.log(await app.getUrl(), 'App Url');
}

bootstrap();
