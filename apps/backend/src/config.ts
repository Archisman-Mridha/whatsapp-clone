import { z } from "zod"

export const configSchema = z.object({
  SERVER_PORT: z.coerce.number(),

  POSTGRES_DB_HOST: z.string(),
  POSTGRES_DB_PORT: z.coerce.number(),
  POSTGRES_DB_USER: z.string(),
  POSTGRES_DB_PASSWORD: z.string(),
  POSTGRES_DB_NAME: z.string(),

  TWILIO_ACCOUNT_SID: z.string(),
  TWILIO_AUTH_TOKEN: z.string(),
  TWILIO_VERIFY_SID: z.string(),

  KAFKA_BROKER_URL: z.string(),

  JWT_SECRET: z.string(),

  MINIO_ENDPOINT: z.string(),
  MINIO_PORT: z.coerce.number(),
  MINIO_ACCESS_KEY: z.string(),
  MINIO_SECRET_KEY: z.string(),

  OTEL_AGENT_ENDPOINT: z.string(),

  ORIGINS: z.string().transform(value => value.split(","))
})

export type Config = z.infer<typeof configSchema>
