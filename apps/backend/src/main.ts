import { NestFactory } from "@nestjs/core"
import { AppModule } from "./modules/app.module"
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify"
import { ConfigService } from "@nestjs/config"
import { Constants, isProductionEnv } from "./utils"
import { ValidationPipe } from "@nestjs/common"
import { MicroserviceOptions, Transport } from "@nestjs/microservices"
import compression from "@fastify/compress"
import tracerProvider from "./tracing"
import { WinstonModule } from "nest-winston"
import { createLogger, format, transports } from "winston"
import { Config } from "./config"
import fastifyHelmet from "@fastify/helmet"

async function main() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    bufferLogs: true
  })

  app.useLogger(
    WinstonModule.createLogger({
      instance: createLogger({
        format: format.combine(
          format.timestamp(),
          format.colorize({ all: !isProductionEnv, message: false }),
          isProductionEnv ? format.json() : format.simple(),
          format.errors({ stack: true })
        ),
        transports: [new transports.Console()]
      })
    })
  )

  await tracerProvider.start()

  app.useGlobalPipes(new ValidationPipe())

  const configService = app.get(ConfigService<Config>)

  // NOTE : By default, @fastify/compress will use Brotli compression (on Node >= 11.7.0) when
  // browsers indicate support for the encoding. While Brotli can be quite efficient in terms of
  // compression ratio, it can also be quite slow.
  await app.register(compression)

  // Cross-origin resource sharing (CORS) is a mechanism that allows resources to be requested from
  // another domain.
  app.enableCors({
    origin: configService.get("ORIGINS")
  })

  // Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP
  // headers appropriately. Generally, Helmet is just a collection of smaller middleware functions
  // that set security-related HTTP headers.
  // Read more here : https://github.com/helmetjs/helmet.
  // NOTE : Using this, causes problem for the ApolloServerPluginLandingPageLocalDefault plugin.
  if (isProductionEnv) await app.register(fastifyHelmet)

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: Constants.KAFKA_CLIENT_ID as string,
        brokers: [configService.get("KAFKA_BROKER_URL")]
      },
      consumer: {
        groupId: Constants.KAFKA_CONSUMER_GROUP_ID as string
      }
    }
  })
  await app.startAllMicroservices()

  const port = configService.get("SERVER_PORT")
  app.listen(port, "0.0.0.0")
}
main()
