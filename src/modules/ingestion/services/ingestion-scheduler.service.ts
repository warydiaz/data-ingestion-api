/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { IngestionService } from './ingestion.service';
import { S3Service } from '../../../core/s3/s3.service';
import { Source1Adapter } from '../adapters/source1.adapter';
import { Source2Adapter } from '../adapters/source2.adapter';
import { S3ConfigService } from '../../../config/s3.config';

@Injectable()
export class IngestionSchedulerService {
  private readonly logger = new Logger(IngestionSchedulerService.name);

  constructor(
    private ingestionService: IngestionService,
    private s3Service: S3Service,
    private source1Adapter: Source1Adapter,
    private source2Adapter: Source2Adapter,
    private s3ConfigService: S3ConfigService,
  ) {}

  @Cron('0 2 * * *')
  async scheduleSource1Ingestion() {
    const sourceConfig = this.s3ConfigService.getSourceConfig('source1');

    if (!sourceConfig || !sourceConfig.enabled) {
      this.logger.log('Source 1 ingestion is disabled');
      return;
    }

    this.logger.log('Starting Source 1 ingestion...');
    try {
      const data = await this.s3Service.getObjectAsJSON(
        sourceConfig.bucket,
        sourceConfig.key,
      );
      const result = await this.ingestionService.ingestFromJSON(
        data,
        this.source1Adapter,
        'source1',
      );

      this.logger.log(
        `Source 1 ingestion completed: ${result.processed} processed, ${result.successful} successful, ${result.failed} failed`,
      );
    } catch (error) {
      this.logger.error(`Source 1 ingestion failed: ${error.message}`);
    }
  }

  @Cron('0 3 * * 0')
  async scheduleSource2Ingestion() {
    const sourceConfig = this.s3ConfigService.getSourceConfig('source2');

    if (!sourceConfig || !sourceConfig.enabled) {
      this.logger.log('Source 2 ingestion is disabled');
      return;
    }

    this.logger.log('Starting Source 2 ingestion (this may take a while)...');
    try {
      const data = await this.s3Service.getObjectAsJSON(
        sourceConfig.bucket,
        sourceConfig.key,
      );
      const result = await this.ingestionService.ingestFromJSON(
        data,
        this.source2Adapter,
        'source2',
      );

      this.logger.log(
        `Source 2 ingestion completed: ${result.processed} processed, ${result.successful} successful, ${result.failed} failed`,
      );
    } catch (error) {
      this.logger.error(`Source 2 ingestion failed: ${error.message}`);
    }
  }

  // Manual trigger para testing
  async triggerSource1Ingestion() {
    return this.scheduleSource1Ingestion();
  }

  async triggerSource2Ingestion() {
    return this.scheduleSource2Ingestion();
  }
}
