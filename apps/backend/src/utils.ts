export enum Constants {
  MAX_GRAPHQL_QUERY_COMPLEXITY = 30,

  // Kafka.
  KAFKA_CLUSTER = "KAFKA_CLUSTER",
  KAFKA_CLIENT_ID = "whatsapp-clone",
  KAFKA_CONSUMER_GROUP_ID = "whatsapp-clone",
  KAFKA_TOPIC_USERS = "db-events.public.users",

  // Minio.
  MINIO_BUCKET_PROFILE_PICTURES = "profile-pictures",
  MINIO_BUCKET_GROUP_PROFILE_PICTURES = "group-profile-pictures",
  MINIO_PRESIGNED_URL_LONGIVITY = 120 // (seconds)
}

export enum ApplicationErrors {
  // Signup.
  PHONE_IS_ALREADY_REGISTERED = "Phone number is already registered",
  RETRY_OTP_VERIFICATION = "Please retry verifying your account",

  // Signin.
  UNAUTHENTICATED = "User is unauthenticated",
  WRONG_PASSWORD = "Wrong password",

  // General.
  SERVER = "Unexpected server error occurred"
}

export const isProductionEnv = process.env.NODE_ENV === "production"

export type DBEventOp = "c" | "r" | "u" | "d"
