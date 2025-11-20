import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoDbModule } from './core/database/mongodb.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { IngestionModule } from './modules/ingestion/ingestion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    MongoDbModule,
    PropertiesModule,
    IngestionModule,
  ],
})
export class AppModule {}
