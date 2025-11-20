/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PropertiesRepository } from 'src/modules/properties/repositories/properties.repository';
import { UnifiedProperty } from 'src/shared/interfaces/unified-property.interface';

describe('PropertiesRepository', () => {
  let repository: PropertiesRepository;
  let mockModel: any;

  beforeEach(async () => {
    mockModel = {
      bulkWrite: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
      countDocuments: jest.fn().mockResolvedValue(0),
      deleteMany: jest.fn().mockResolvedValue({}),
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    };

    const module = await Test.createTestingModule({
      providers: [
        PropertiesRepository,
        {
          provide: getModelToken('Property'),
          useValue: mockModel,
        },
      ],
    }).compile();

    repository = module.get<PropertiesRepository>(PropertiesRepository);
  });

  describe('insertMany', () => {
    it('should insert multiple properties with upsert', async () => {
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
          sourceId: 'source2',
          externalId: 'abc',
          city: 'Madrid',
          availability: false,
          pricePerNight: 200,
          sourceData: {},
        },
      ];

      await repository.insertMany(properties);

      expect(mockModel.bulkWrite).toHaveBeenCalled();
      const operations = mockModel.bulkWrite.mock.calls[0][0];
      expect(operations).toHaveLength(2);
      expect(operations[0].updateOne.filter.sourceId).toBe('source1');
      expect(operations[0].updateOne.upsert).toBe(true);
    });

    it('should handle empty array', async () => {
      await repository.insertMany([]);

      expect(mockModel.bulkWrite).not.toHaveBeenCalled();
    });
  });

  describe('find', () => {
    it('should find properties with pagination', async () => {
      mockModel.exec.mockResolvedValue([{ _id: '1', city: 'Barcelona' }]);

      const result = await repository.find({ city: 'Barcelona' }, 10, 0);

      expect(mockModel.find).toHaveBeenCalledWith({ city: 'Barcelona' });
      expect(mockModel.limit).toHaveBeenCalledWith(10);
      expect(mockModel.skip).toHaveBeenCalledWith(0);
      expect(result).toHaveLength(1);
    });
  });

  describe('count', () => {
    it('should count documents matching query', async () => {
      mockModel.countDocuments.mockResolvedValue(42);

      const result = await repository.count({ city: 'Barcelona' });

      expect(mockModel.countDocuments).toHaveBeenCalledWith({
        city: 'Barcelona',
      });
      expect(result).toBe(42);
    });
  });
});
