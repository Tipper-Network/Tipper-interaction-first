import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  /**
   * Deletes expired email verification tokens from the database.
   *
   * Runs daily at 1:00 AM (server time) via Nest Schedule.
   *
   * @returns Resolves when cleanup completes.
   */
  async handleExpiredVerificationTokens() {
    const result = await this.prisma.emailVerificationToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    if (result.count > 0) {
      this.logger.log(
        `Deleted ${result.count} expired email verification tokens`,
      );
    }
  }
}
