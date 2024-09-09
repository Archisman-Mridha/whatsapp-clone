import { Controller, Get } from "@nestjs/common"
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from "@nestjs/terminus"

@Controller("health")
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
      () => this.db.pingCheck("database")

      // TODO: Add Kafka connection health check

      // TODO: Add Minio connection health check
    ])
  }
}
