import { ConsoleLogger } from "@nestjs/common"
import { z } from "zod"

export const isProductionEnv = () => process.env.NODE_ENV === "production"

export const configSchema = z.object({
  SERVER_PORT: z.string().transform(value => parseInt(value)),

  POSTGRES_DB_HOST: z.string(),
  POSTGRES_DB_PORT: z.string().transform(value => parseInt(value)),
  POSTGRES_DB_USER: z.string(),
  POSTGRES_DB_PASSWORD: z.string(),
  POSTGRES_DB_NAME: z.string(),

  TWILIO_ACCOUNT_SID: z.string(),
  TWILIO_AUTH_TOKEN: z.string(),
  TWILIO_VERIFY_SID: z.string(),

  KAFKA_BROKER_URL: z.string(),

  JWT_SECRET: z.string(),

  MINIO_ENDPOINT: z.string(),
  MINIO_PORT: z.string().transform(value => parseInt(value)),
  MINIO_ACCESS_KEY: z.string(),
  MINIO_SECRET_KEY: z.string(),

  JAEGER_URL: z.string()
})

export const PhoneIsAlreadyRegisteredError = new Error("Phone number is already registered"),
  RetryOTPVerificationError = new Error("Please retry verifying your account"),
  UnAuthenticatedError = new Error("User is unauthenticated"),
  WrongPasswordError = new Error("Wrong password"),
  ServerError = new Error("Unexpected server error occurred")

export class CustomLogger extends ConsoleLogger {
  error(message: unknown): void {
    if (
      [
        PhoneIsAlreadyRegisteredError.message,
        RetryOTPVerificationError.message,
        UnAuthenticatedError.message,
        WrongPasswordError.message,
        ServerError.message
      ].includes(message as string)
    )
      return

    //@ts-ignore
    super.error(...arguments)
  }
}

export const KAFKA_CLUSTER = Symbol("KAFKA_CLUSTER")

export enum KafkaTopic {
  Users = "db-events.public.users"
}

export enum MinioBucket {
  ProfilePictures = "profile-pictures",
  GroupProfilePictures = "group-profile-pictures"
}
