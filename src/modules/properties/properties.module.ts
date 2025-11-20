import { Module } from '@nestjs/common';
import { MongoDbModule } from '../../core/database/mongodb.module';
import { PropertiesController } from './controllers/properties.controller';
import { PropertiesService } from './services/properties.service';
import { PropertiesRepository } from './repositories/properties.repository';
import { PropertiesQueryService } from './services/properties-query.service';

@Module({
  imports: [MongoDbModule],
  controllers: [PropertiesController],
  providers: [PropertiesService, PropertiesRepository, PropertiesQueryService],
  exports: [PropertiesService, PropertiesRepository],
})
export class PropertiesModule {}
