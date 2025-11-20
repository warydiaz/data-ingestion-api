/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// 5. src/modules/ingestion/adapters/source1.adapter.ts
import { Injectable } from '@nestjs/common';
import { BaseDataSourceAdapter } from './base.adapter';
import { UnifiedProperty } from '../../../shared/interfaces/unified-property.interface';

@Injectable()
export class Source1Adapter extends BaseDataSourceAdapter {
  validate(data: any): boolean {
    if (!super.validate(data)) return false;
    return !!(
      data.id &&
      data.address?.city &&
      data.priceForNight !== undefined
    );
  }

  transformToUnified(raw: any): UnifiedProperty {
    const unified: UnifiedProperty = {
      sourceId: 'source1',
      externalId: raw.id.toString(),
      name: raw.name,
      city: raw.address?.city || '',
      country: raw.address?.country,
      availability: raw.isAvailable ?? false,
      pricePerNight: raw.priceForNight,
      address: raw.address,
      sourceData: raw,
    };
    return this.addMetadata(unified);
  }
}
