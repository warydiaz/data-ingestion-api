/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test } from '@nestjs/testing';
import { Source1Adapter } from 'src/modules/ingestion/adapters/source1.adapter';
import { IngestionService } from 'src/modules/ingestion/services/ingestion.service';
import { PropertiesRepository } from 'src/modules/properties/repositories/properties.repository';

describe('IngestionService', () => {
  let service: IngestionService;
  let mockRepository: any;
  let adapter: Source1Adapter;

  beforeEach(async () => {
    mockRepository = {
      insertMany: jest.fn().mockResolvedValue({}),
    };

    const module = await Test.createTestingModule({
      providers: [
        IngestionService,
        Source1Adapter,
        {
          provide: PropertiesRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    adapter = module.get<Source1Adapter>(Source1Adapter);
  });

  describe('ingestFromJSON', () => {
    it('should ingest JSON data successfully', async () => {
      const data = [
        {
          id: 123456,
          name: 'Hotel Barcelona',
          address: { country: 'Spain', city: 'Barcelona' },
          isAvailable: true,
          priceForNight: 150,
        },
        {
          id: 123457,
          name: 'Hotel Madrid',
          address: { country: 'Spain', city: 'Madrid' },
          isAvailable: true,
          priceForNight: 200,
        },
      ];

      const result = await service.ingestFromJSON(data, adapter, 'test-source');

      expect(result.processed).toBe(2);
      expect(result.successful).toBe(2);
      expect(result.failed).toBe(0);
      expect(mockRepository.insertMany).toHaveBeenCalled();
    });

    it('should handle invalid data', async () => {
      const data = [
        {
          id: 123456,
          name: 'Hotel Barcelona',
          address: { country: 'Spain', city: 'Barcelona' },
          isAvailable: true,
          priceForNight: 150,
        },
        {
          invalid: 'data',
        },
      ];

      const result = await service.ingestFromJSON(data, adapter, 'test-source');

      expect(result.processed).toBe(2);
      expect(result.successful).toBe(1);
      expect(result.failed).toBe(1);
    });

    it('should batch insert records', async () => {
      const data = Array.from({ length: 2500 }, (_, i) => ({
        id: 100000 + i,
        name: `Hotel ${i}`,
        address: { country: 'Spain', city: 'Barcelona' },
        isAvailable: true,
        priceForNight: 150,
      }));

      await service.ingestFromJSON(data, adapter, 'test-source');

      // Should call insertMany at least 3 times (2500 / 1000 batch size)
      expect(mockRepository.insertMany).toHaveBeenCalledTimes(3);
    });
  });
});
