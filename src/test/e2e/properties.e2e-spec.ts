/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PropertiesRepository } from '../../../src/modules/properties/repositories/properties.repository';
import { UnifiedProperty } from '../../../src/shared/interfaces/unified-property.interface';

describe('Properties API (e2e)', () => {
  let app: INestApplication;
  let propertiesRepository: PropertiesRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    propertiesRepository =
      moduleFixture.get<PropertiesRepository>(PropertiesRepository);
  });

  beforeEach(async () => {
    // Clean up before each test
    await propertiesRepository.deleteAll();
  }, 10000); // Increase timeout to 10 seconds

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/properties', () => {
    it('should return empty list when no properties', () => {
      return request(app.getHttpServer())
        .get('/api/properties')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toEqual([]);
          expect(res.body.total).toBe(0);
        });
    });

    it('should filter properties by city', async () => {
      const property: UnifiedProperty = {
        sourceId: 'source1',
        externalId: '123',
        name: 'Hotel Barcelona',
        city: 'Barcelona',
        country: 'Spain',
        availability: true,
        pricePerNight: 150,
        sourceData: {},
      };

      await propertiesRepository.insertMany([property]);

      return request(app.getHttpServer())
        .get('/api/properties?city=Barcelona')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0].city).toBe('Barcelona');
        });
    });

    it('should filter properties by price range', async () => {
      const properties: UnifiedProperty[] = [
        {
          sourceId: 'source1',
          externalId: '123',
          city: 'Barcelona',
          availability: true,
          pricePerNight: 100,
          sourceData: {},
        },
        {
          sourceId: 'source1',
          externalId: '124',
          city: 'Barcelona',
          availability: true,
          pricePerNight: 500,
          sourceData: {},
        },
      ];

      await propertiesRepository.insertMany(properties);

      return request(app.getHttpServer())
        .get('/api/properties?priceMin=200&priceMax=600')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0].pricePerNight).toBe(500);
        });
    });

    it('should filter by availability', async () => {
      const properties: UnifiedProperty[] = [
        {
          sourceId: 'source1',
          externalId: '123',
          city: 'Barcelona',
          availability: true,
          pricePerNight: 100,
          sourceData: {},
        },
        {
          sourceId: 'source1',
          externalId: '124',
          city: 'Barcelona',
          availability: false,
          pricePerNight: 100,
          sourceData: {},
        },
      ];

      await propertiesRepository.insertMany(properties);

      return request(app.getHttpServer())
        .get('/api/properties?availability=true')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0].availability).toBe(true);
        });
    });
  });

  describe('POST /api/properties/query', () => {
    it('should query with body filters', async () => {
      const property: UnifiedProperty = {
        sourceId: 'source1',
        externalId: '123',
        name: 'Hotel Barcelona',
        city: 'Barcelona',
        country: 'Spain',
        availability: true,
        pricePerNight: 150,
        sourceData: {},
      };

      await propertiesRepository.insertMany([property]);

      return request(app.getHttpServer())
        .post('/api/properties/query')
        .send({ city: 'Barcelona', priceMin: 100, priceMax: 200 })
        .expect(201)
        .expect((res) => {
          expect(res.body.data).toHaveLength(1);
        });
    });
  });
});
