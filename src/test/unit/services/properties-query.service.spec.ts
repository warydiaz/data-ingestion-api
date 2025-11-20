/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test } from '@nestjs/testing';
import { PropertiesQueryService } from 'src/modules/properties/services/properties-query.service';
import { QueryFilterDto } from 'src/modules/properties/dtos/query-filter.dto';

describe('PropertiesQueryService', () => {
  let service: PropertiesQueryService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PropertiesQueryService],
    }).compile();

    service = module.get<PropertiesQueryService>(PropertiesQueryService);
  });

  describe('buildMongoQuery', () => {
    it('should build query with city filter', () => {
      const filters: QueryFilterDto = { city: 'Barcelona' };
      const query = service.buildMongoQuery(filters);

      expect(query.city).toBeDefined();
      expect(query.city.$regex).toBe('Barcelona');
      expect(query.city.$options).toBe('i');
    });

    it('should build query with price range', () => {
      const filters: QueryFilterDto = { priceMin: 100, priceMax: 500 };
      const query = service.buildMongoQuery(filters);

      expect(query.pricePerNight.$gte).toBe(100);
      expect(query.pricePerNight.$lte).toBe(500);
    });

    it('should build query with availability filter', () => {
      const filters: QueryFilterDto = { availability: true };
      const query = service.buildMongoQuery(filters);

      expect(query.availability).toBe(true);
    });

    it('should build query with search text', () => {
      const filters: QueryFilterDto = { search: 'hotel' };
      const query = service.buildMongoQuery(filters);

      expect(query.$or).toBeDefined();
      expect(query.$or.length).toBe(3);
      expect(query.$or[0].name).toBeDefined();
      expect(query.$or[1].city).toBeDefined();
      expect(query.$or[2].country).toBeDefined();
    });

    it('should build query with multiple filters', () => {
      const filters: QueryFilterDto = {
        city: 'Barcelona',
        availability: true,
        priceMin: 100,
        priceMax: 500,
      };
      const query = service.buildMongoQuery(filters);

      expect(query.city).toBeDefined();
      expect(query.availability).toBe(true);
      expect(query.pricePerNight.$gte).toBe(100);
      expect(query.pricePerNight.$lte).toBe(500);
    });

    it('should return empty query if no filters provided', () => {
      const filters: QueryFilterDto = {};
      const query = service.buildMongoQuery(filters);

      expect(Object.keys(query).length).toBe(0);
    });
  });
});
