/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// 5. src/modules/ingestion/adapters/source1.adapter.ts
import { Injectable } from '@nestjs/common';
import { BaseDataSourceAdapter } from './base.adapter';
import { UnifiedProperty } from '../../../shared/interfaces/unified-property.interface';

@Injectable()
export class Source2Adapter extends BaseDataSourceAdapter {
  validate(data: any): boolean {
    if (!super.validate(data)) return false;
    return !!(data.id && data.city && data.pricePerNight !== undefined);
  }

  transformToUnified(raw: any): UnifiedProperty {
    const unified: UnifiedProperty = {
      sourceId: 'source2',
      externalId: raw.id,
      city: raw.city,
      availability: raw.availability ?? false,
      pricePerNight: raw.pricePerNight,
      priceSegment: raw.priceSegment,
      sourceData: raw,
    };
    return this.addMetadata(unified);
  }
}
