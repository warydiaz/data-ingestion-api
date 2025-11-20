/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test } from '@nestjs/testing';
import { Source1Adapter } from 'src/modules/ingestion/adapters/source1.adapter';

describe('Source1Adapter', () => {
  let adapter: Source1Adapter;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [Source1Adapter],
    }).compile();

    adapter = module.get<Source1Adapter>(Source1Adapter);
  });

  describe('validate', () => {
    it('should validate correct source1 data', () => {
      const validData = {
        id: 123456,
        name: 'Beautiful Hotel',
        address: { country: 'Spain', city: 'Barcelona' },
        isAvailable: true,
        priceForNight: 150,
      };
      expect(adapter.validate(validData)).toBe(true);
    });

    it('should reject invalid data', () => {
      expect(adapter.validate(null)).toBe(false);
      expect(adapter.validate({})).toBe(false);
    });
  });

  describe('transformToUnified', () => {
    it('should transform source1 data correctly', () => {
      const rawData = {
        id: 123456,
        name: 'Beautiful Hotel',
        address: { country: 'Spain', city: 'Barcelona' },
        isAvailable: true,
        priceForNight: 150,
      };

      const result = adapter.transformToUnified(rawData);

      expect(result.sourceId).toBe('source1');
      expect(result.externalId).toBe('123456');
      expect(result.name).toBe('Beautiful Hotel');
      expect(result.city).toBe('Barcelona');
      expect(result.country).toBe('Spain');
      expect(result.availability).toBe(true);
      expect(result.pricePerNight).toBe(150);
      expect(result.ingestionDate).toBeDefined();
    });
  });
});
