import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { PropertiesService } from '../services/properties.service';
import { QueryFilterDto } from '../dtos/query-filter.dto';
import { PropertyResponseDto } from '../dtos/property-response.dto';

@Controller('api/properties')
export class PropertiesController {
  constructor(private propertiesService: PropertiesService) {}

  @Get()
  async getProperties(@Query() filters: QueryFilterDto): Promise<{
    data: PropertyResponseDto[];
    total: number;
    limit: number;
    offset: number;
  }> {
    return this.propertiesService.queryProperties(filters);
  }

  @Get(':id')
  async getPropertyById(@Param('id') id: string): Promise<PropertyResponseDto> {
    const property = await this.propertiesService.getPropertyById(id);
    if (!property) {
      throw new BadRequestException('Property not found');
    }
    return property;
  }

  @Post('query')
  async queryPropertiesWithBody(@Body() filters: QueryFilterDto): Promise<{
    data: PropertyResponseDto[];
    total: number;
    limit: number;
    offset: number;
  }> {
    return this.propertiesService.queryProperties(filters);
  }
}
