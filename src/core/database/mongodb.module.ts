import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Property, PropertySchema } from './models/property.model';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') ||
          'mongodb://localhost:27017/data-ingestion',
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: 'Property', schema: PropertySchema }]),
  ],
  exports: [MongooseModule],
})
export class MongoDbModule {}
