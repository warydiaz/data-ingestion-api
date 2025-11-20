/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test } from '@nestjs/testing';
import { Source2Adapter } from 'src/modules/ingestion/adapters/source2.adapter';

describe('Source2Adapter', () => {
  let adapter: Source2Adapter;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [Source2Adapter],
    }).compile();

    adapter = module.get<Source2Adapter>(Source2Adapter);
  });

  describe('validate', () => {
    it('should validate correct source2 data', () => {
      const validData = {
        id: 'abc12345',
        city: 'Madrid',
        availability: true,
        pricePerNight: 200,
        priceSegment: 'high',
      };
      expect(adapter.validate(validData)).toBe(true);
    });

    it('should reject invalid data', () => {
      expect(adapter.validate(null)).toBe(false);
      expect(adapter.validate({ id: 'abc' })).toBe(false);
    });
  });

  describe('transformToUnified', () => {
    it('should transform source2 data correctly', () => {
      const rawData = {
        id: 'abc12345',
        city: 'Madrid',
        availability: true,
        pricePerNight: 200,
        priceSegment: 'high',
      };

      const result = adapter.transformToUnified(rawData);

      expect(result.sourceId).toBe('source2');
      expect(result.externalId).toBe('abc12345');
      expect(result.city).toBe('Madrid');
      expect(result.availability).toBe(true);
      expect(result.pricePerNight).toBe(200);
      expect(result.priceSegment).toBe('high');
    });
  });
});
