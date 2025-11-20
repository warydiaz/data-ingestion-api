import { Controller, Post, Get, Logger } from '@nestjs/common';
import { IngestionSchedulerService } from '../services/ingestion-scheduler.service';

@Controller('api/ingestion')
export class IngestionController {
  private readonly logger = new Logger(IngestionController.name);

  constructor(private ingestionSchedulerService: IngestionSchedulerService) {}

  @Post('trigger-source1')
  async triggerSource1() {
    this.logger.log('Manual trigger for Source 1 ingestion');
    await this.ingestionSchedulerService.triggerSource1Ingestion();
    return { message: 'Source 1 ingestion triggered' };
  }

  @Post('trigger-source2')
  async triggerSource2() {
    this.logger.log('Manual trigger for Source 2 ingestion');
    await this.ingestionSchedulerService.triggerSource2Ingestion();
    return { message: 'Source 2 ingestion triggered' };
  }

  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date() };
  }
}
