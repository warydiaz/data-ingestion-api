/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test } from '@nestjs/testing';
import { PropertiesService } from 'src/modules/properties/services/properties.service';
import { PropertiesRepository } from 'src/modules/properties/repositories/properties.repository';
import { PropertiesQueryService } from 'src/modules/properties/services/properties-query.service';
import { QueryFilterDto } from 'src/modules/properties/dtos/query-filter.dto';

describe('PropertiesService', () => {
  let service: PropertiesService;
  let mockRepository: any;
  let mockQueryService: any;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
      findById: jest.fn().mockResolvedValue(null),
    };

    mockQueryService = {
      buildMongoQuery: jest.fn().mockReturnValue({}),
    };

    const module = await Test.createTestingModule({
      providers: [
        PropertiesService,
        {
          provide: PropertiesRepository,
          useValue: mockRepository,
        },
        {
          provide: PropertiesQueryService,
          useValue: mockQueryService,
        },
      ],
    }).compile();

    service = module.get<PropertiesService>(PropertiesService);
  });

  describe('queryProperties', () => {
    it('should query properties with filters', async () => {
      const mockProperty = {
        _id: { toString: () => '1' },
        sourceId: 'source1',
        externalId: '123',
        name: 'Hotel',
        city: 'Barcelona',
        country: 'Spain',
        availability: true,
        pricePerNight: 100,
        priceSegment: 'low',
        ingestionDate: new Date(),
        lastUpdated: new Date(),
      };

      mockRepository.find.mockResolvedValue([mockProperty]);
      mockRepository.count.mockResolvedValue(1);

      const filters: QueryFilterDto = { city: 'Barcelona' };
      const result = await service.queryProperties(filters);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.data[0].city).toBe('Barcelona');
    });

    it('should return paginated results', async () => {
      mockRepository.find.mockResolvedValue([]);
      mockRepository.count.mockResolvedValue(100);

      const filters: QueryFilterDto = { limit: 20, offset: 0 };
      const result = await service.queryProperties(filters);

      expect(mockRepository.find).toHaveBeenCalledWith({}, 20, 0);
      expect(result.limit).toBe(20);
      expect(result.offset).toBe(0);
    });
  });

  describe('getPropertyById', () => {
    it('should get property by id', async () => {
      const mockProperty = {
        _id: { toString: () => '1' },
        sourceId: 'source1',
        externalId: '123',
        city: 'Barcelona',
        availability: true,
        pricePerNight: 100,
        ingestionDate: new Date(),
        lastUpdated: new Date(),
      };

      mockRepository.findById.mockResolvedValue(mockProperty);

      const result = await service.getPropertyById('1');

      expect(result).toBeDefined();
      expect(result!._id).toBe('1');
    });

    it('should return null if property not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await service.getPropertyById('nonexistent');

      expect(result).toBeNull();
    });
  });
});
