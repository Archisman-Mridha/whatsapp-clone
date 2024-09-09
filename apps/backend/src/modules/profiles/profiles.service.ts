import { Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ProfileEntity } from "./profile.entity"
import { CreateProfileArgs, UpdateProfileArgs } from "./types"
import { KafkaRetriableException } from "@nestjs/microservices"
import { InjectMinio } from "nestjs-minio"
import { Client } from "minio"
import { ApplicationErrors, Constants } from "../../utils"

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profilesRepository: Repository<ProfileEntity>,

    @InjectMinio()
    private readonly minioClient: Client
  ) {}

  private readonly logger = new Logger("ProfilesModule")

  // throws : KafkaRetriableException
  async createProfile(args: CreateProfileArgs) {
    await this.profilesRepository.insert(args).catch(error => {
      this.logger.log("Unexpected error creating new profile", error)
      throw new KafkaRetriableException("")
    })
  }

  // throws : ServerError
  async updateProfile(userId: number, args: UpdateProfileArgs) {
    await this.profilesRepository.update(userId, args).catch(error => {
      this.logger.log("Unexpected error updating profile", error)
      throw ApplicationErrors.SERVER
    })
  }

  // throws : ServerError
  async getPresignedProfilePictureUri(userId: number): Promise<string> {
    return await this.minioClient
      .presignedUrl(
        "GET",
        Constants.MINIO_BUCKET_PROFILE_PICTURES,
        userId.toString(),
        Constants.MINIO_PRESIGNED_URL_LONGIVITY
      )
      .catch(error => {
        this.logger.log("Unexpected error getting presigned url", error)
        throw ApplicationErrors.SERVER
      })
  }

  // throws : KafkaRetriableException
  async deleteProfile(id: number) {
    await this.profilesRepository.delete(id).catch(error => {
      this.logger.log("Unexpected error deleting profile", error)
      throw new KafkaRetriableException("")
    })
  }
}
