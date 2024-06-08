import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as fs from "fs";
import * as process from "process";

export async function setupSwagger(app: INestApplication) {
  let swaggerDocPath = "/api-doc";
  const config = new DocumentBuilder()
    .setTitle("PH TASK")
    .setDescription("PH API DOC")
    .setVersion("1.0")
    .addApiKey(
      { type: "apiKey", name: "Authorization", in: "header", scheme: "bearer", bearerFormat: "Bearer" },
      "auth"
    )
    .addApiKey(
      { type: "apiKey", name: "Authorization", in: "header", scheme: "bearer", bearerFormat: "Bearer" },
      "admin-auth"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync("./swagger-spec.json", JSON.stringify(document));

  SwaggerModule.setup(swaggerDocPath, app, document, {
    swaggerOptions: { persistAuthorization: true, ignoreGlobalPrefix: true }
  });
}
