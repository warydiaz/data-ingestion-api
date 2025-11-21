import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { IngestionService } from './services/ingestion.service';
import { IngestionSchedulerService } from './services/ingestion-scheduler.service';
import { IngestionController } from './controllers/ingestion.controller';
import { Source1Adapter } from './adapters/source1.adapter';
import { Source2Adapter } from './adapters/source2.adapter';
import { PropertiesModule } from '../properties/properties.module';
import { S3Module } from '../../core/s3/s3.module';
import { S3ConfigService } from '../../config/s3.config';

@Module({
  imports: [ScheduleModule.forRoot(), PropertiesModule, S3Module],
  providers: [
    IngestionService,
    IngestionSchedulerService,
    Source1Adapter,
    Source2Adapter,
    S3ConfigService,
  ],
  controllers: [IngestionController],
  exports: [IngestionService],
})
export class IngestionModule {}
