/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { QueryFilterDto } from '../dtos/query-filter.dto';

@Injectable()
export class PropertiesQueryService {
  buildMongoQuery(filters: QueryFilterDto): any {
    const query: any = {};

    // Filtros exactos
    if (filters.city) {
      query.city = { $regex: filters.city, $options: 'i' }; // Case-insensitive
    }

    if (filters.country) {
      query.country = { $regex: filters.country, $options: 'i' };
    }

    if (filters.availability !== undefined) {
      query.availability = filters.availability;
    }

    // Rango de precio
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      query.pricePerNight = {};
      if (filters.priceMin !== undefined) {
        query.pricePerNight.$gte = filters.priceMin;
      }
      if (filters.priceMax !== undefined) {
        query.pricePerNight.$lte = filters.priceMax;
      }
    }

    // Búsqueda de texto (name, city)
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { city: { $regex: filters.search, $options: 'i' } },
        { country: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return query;
  }
}
