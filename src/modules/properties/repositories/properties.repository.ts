import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property } from '../../../core/database/models/property.model';
import { UnifiedProperty } from '../../../shared/interfaces/unified-property.interface';

@Injectable()
export class PropertiesRepository {
  constructor(
    @InjectModel('Property') private propertyModel: Model<Property>,
  ) {}

  async insertMany(properties: UnifiedProperty[]): Promise<void> {
    const operations = properties.map((prop) => ({
      updateOne: {
        filter: {
          sourceId: prop.sourceId,
          externalId: prop.externalId,
        },
        update: {
          $set: {
            ...prop,
            lastUpdated: new Date(),
          },
        },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
      await this.propertyModel.bulkWrite(operations);
    }
  }

  async find(
    query: any,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Property[]> {
    return this.propertyModel
      .find(query)
      .limit(limit)
      .skip(offset)
      .sort({ ingestionDate: -1 })
      .exec();
  }

  async count(query: any): Promise<number> {
    return this.propertyModel.countDocuments(query);
  }

  async deleteAll(): Promise<void> {
    await this.propertyModel.deleteMany({});
  }

  async findById(id: string): Promise<Property | null> {
    return this.propertyModel.findById(id).exec();
  }
}
