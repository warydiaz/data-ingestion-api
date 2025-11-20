/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'properties' })
export class Property extends Document {
  sourceId: string;
  externalId: string;
  name?: string;
  city: string;
  country?: string;
  availability: boolean;
  pricePerNight: number;
  priceSegment?: string;
  address?: {
    country: string;
    city: string;
  };
  ingestionDate: Date;
  lastUpdated: Date;
  sourceData: object;
}

export const PropertySchema = SchemaFactory.createForClass(Property);

// Índices
PropertySchema.index({ city: 1 });
PropertySchema.index({ country: 1 });
PropertySchema.index({ pricePerNight: 1 });
PropertySchema.index({ availability: 1 });
PropertySchema.index({ sourceId: 1 });
PropertySchema.index({ ingestionDate: -1 });
PropertySchema.index({ sourceId: 1, externalId: 1 }, { unique: true });

export type PropertyDocument = Property & Document;
