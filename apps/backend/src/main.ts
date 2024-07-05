import { NestFactory } from "@nestjs/core"
import { AppModule } from "./modules/app.module"
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify"
import { ConfigService } from "@nestjs/config"
import { CustomLogger, configSchema } from "./utils"
import { ValidationPipe } from "@nestjs/common"
import { MicroserviceOptions, Transport } from "@nestjs/microservices"
import compression from "@fastify/compress"
import { initInstrumentations } from "./instrumentation"

async function main( ) {
  // NOTE - Fastify is much faster than Express, achieving almost two times better benchmarks
  // results.
  const app= await NestFactory.create<NestFastifyApplication>(AppModule,
                                                              new FastifyAdapter( ))
  await app.register(compression, { encodings: [ "gzip", "deflate" ]})

  app.useGlobalPipes(new ValidationPipe( ))
  app.useLogger(new CustomLogger( ))

  const configService= app.get(ConfigService<typeof configSchema._type>)

  // In NestJS, a microservice is fundamentally an application that uses a different transport layer
  // than HTTP.
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: "whatsapp-clone",
        brokers: [ configService.get("KAFKA_BROKER_URL") ]
      },
      consumer: {
        groupId: "whatsapp-clone-consumer"
      }
    }
  })
  await app.startAllMicroservices( )

  initInstrumentations(configService.get("JAEGER_URL"))

  // Cross-origin resource sharing (CORS) is a mechanism that allows resources to be requested from
  // another domain.
  app.enableCors( )

  const port= configService.get("SERVER_PORT")
  app.listen(port, "0.0.0.0")
}

main( )