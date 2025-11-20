export class PropertyResponseDto {
  _id?: string;
  sourceId: string;
  externalId: string;
  name?: string;
  city: string;
  country?: string;
  availability: boolean;
  pricePerNight: number;
  priceSegment?: string;
  ingestionDate: Date;
  lastUpdated: Date;
}
