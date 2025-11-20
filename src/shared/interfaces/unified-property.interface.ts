export interface UnifiedProperty {
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
  ingestionDate?: Date;
  lastUpdated?: Date;
  sourceData: any;
}
