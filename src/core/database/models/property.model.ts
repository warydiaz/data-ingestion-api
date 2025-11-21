/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'properties' })
export class Property extends Document {
  @Prop({ required: true, index: true })
  sourceId: string;

  @Prop({ required: true, index: true })
  externalId: string;

  @Prop()
  name?: string;

  @Prop({ required: true, index: true })
  city: string;

  @Prop({ index: true })
  country?: string;

  @Prop({ required: true, index: true })
  availability: boolean;

  @Prop({ required: true, index: true })
  pricePerNight: number;

  @Prop({ index: true })
  priceSegment?: string;

  @Prop({ type: Object })
  address?: {
    country: string;
    city: string;
  };

  @Prop({ required: true })
  ingestionDate: Date;

  @Prop({ required: true })
  lastUpdated: Date;

  @Prop({ type: Object })
  sourceData: object;
}

export const PropertySchema = SchemaFactory.createForClass(Property);

// Índices compuestos
PropertySchema.index({ city: 1, pricePerNight: 1 });
PropertySchema.index({ country: 1, availability: 1 });
PropertySchema.index({ sourceId: 1, externalId: 1 }, { unique: true });
PropertySchema.index({ ingestionDate: -1 });

export type PropertyDocument = Property & Document;
