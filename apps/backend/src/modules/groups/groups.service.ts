import { Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource, Repository } from "typeorm"
import { GroupEntity } from "./group.entity"
import { CreateGroupArgs } from "./types"
import { ServerError } from "../../utils"

@Injectable( )
export class GroupsService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupsRepository: Repository<GroupEntity>,

    private readonly dataSource: DataSource
  ) { }

  private readonly logger= new Logger("GroupsModule")

  // throws : ServerError
  async createGroup(adminId: number, args: CreateGroupArgs): Promise<string> {
    let groupId: string

    const entityManager= this.dataSource.createEntityManager( )

    await entityManager.transaction(async transactionalEntityManager => {
      groupId= await transactionalEntityManager.insert(GroupEntity, args)
                                               .then(({ identifiers }) => identifiers[0].id)

      for(const userId of args.userIds) {
        await transactionalEntityManager.query(`

          UPDATE profiles
            SET group_ids= array_append(group_ids, ${groupId})
            WHERE id= ${userId};

          INSERT INTO user_group_junctions
            (user_id, group_id, is_admin)
            VALUES (
              ${userId},
              ${groupId},
              ${userId == adminId ? 'true' : 'false'}
            );
        `)
      }
    })
      .catch(error => {
        this.logger.log("Error occurred while executing CreateGroup transaction", error)
        throw ServerError
      })

    return groupId
  }
}