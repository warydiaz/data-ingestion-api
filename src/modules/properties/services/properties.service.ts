/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PropertiesRepository } from '../repositories/properties.repository';
import { PropertiesQueryService } from './properties-query.service';
import { QueryFilterDto } from '../dtos/query-filter.dto';
import { PropertyResponseDto } from '../dtos/property-response.dto';

@Injectable()
export class PropertiesService {
  constructor(
    private repository: PropertiesRepository,
    private queryService: PropertiesQueryService,
  ) {}

  async queryProperties(filters: QueryFilterDto): Promise<{
    data: PropertyResponseDto[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const mongoQuery = this.queryService.buildMongoQuery(filters);
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;

    const [data, total] = await Promise.all([
      this.repository.find(mongoQuery, limit, offset),
      this.repository.count(mongoQuery),
    ]);

    return {
      data: data.map(this.mapToResponseDto.bind(this)),
      total,
      limit,
      offset,
    };
  }

  async getPropertyById(id: string): Promise<PropertyResponseDto | null> {
    const property = await this.repository.findById(id);
    return property ? this.mapToResponseDto(property) : null;
  }

  private mapToResponseDto(property: any): PropertyResponseDto {
    return {
      _id: property._id?.toString(),
      sourceId: property.sourceId,
      externalId: property.externalId,
      name: property.name,
      city: property.city,
      country: property.country,
      availability: property.availability,
      pricePerNight: property.pricePerNight,
      priceSegment: property.priceSegment,
      ingestionDate: property.ingestionDate,
      lastUpdated: property.lastUpdated,
    };
  }
}
