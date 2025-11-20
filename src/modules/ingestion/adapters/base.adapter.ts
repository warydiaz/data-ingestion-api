import { UnifiedProperty } from '../../../shared/interfaces/unified-property.interface';

export abstract class BaseDataSourceAdapter {
  abstract transformToUnified(rawData: any): UnifiedProperty;

  validate(data: any): boolean {
    if (!data) return false;
    return true;
  }

  protected addMetadata(property: UnifiedProperty): UnifiedProperty {
    return {
      ...property,
      ingestionDate: new Date(),
      lastUpdated: new Date(),
    };
  }
}
