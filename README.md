# Data Ingestion Backend

Multi-source JSON data ingestion service with MongoDB storage and flexible query API.

## Features

- 🔄 Multiple data source support (Source 1: 200KB, Source 2: 150MB)
- 🚀 Scalable streaming ingestion for large files
- 🔍 Flexible filtering API (city, country, price range, availability, text search)
- 📦 Automatic batch processing and deduplication
- ⏰ Scheduled ingestion with Cron jobs
- 🏗️ Adapter pattern for easy source extensibility
- 🐳 Docker Compose setup

## Tech Stack

- NestJS + TypeScript
- MongoDB + Mongoose
- AWS S3
- Jest + Supertest

## Installation

```bash
npm install
```

## Environment Setup

Copy `.env`:
```bash
MONGODB_URI=mongodb://localhost:27017/data-ingestion
NODE_ENV=development
PORT=3000

# AWS S3 Configuration
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key

# S3 Buckets
# Bucket names
S3_BUCKET_1=buenro-tech-assessment-materials
S3_BUCKET_2=buenro-tech-assessment-materials

# Keys (objetos dentro del bucket)
S3_SOURCE1_KEY=structured_generated_data.json
S3_SOURCE2_KEY=large_generated_data.json
```

## Running Locally

```bash
# Start MongoDB
docker-compose up mongodb

# Run the app
npm run start:dev
```

## Running with Docker

```bash
docker-compose up
```

## API Endpoints

### Query Properties

```bash
# Get all properties
GET /api/properties

# Filter by city
GET /api/properties?city=Osaka

# Filter by price range
GET /api/properties?priceMin=100&priceMax=500

# Filter by availability
GET /api/properties?availability=true

# Text search
GET /api/properties?search=Cabin

# Pagination
GET /api/properties?limit=20&offset=0

# Complex query via POST
POST /api/properties/query
{
  "city": "Tokyo",
  "country": "Japan",
  "availability": true,
  "priceMin": 200,
  "priceMax": 600,
  "limit": 20,
  "offset": 0
}
```

### Ingestion Control (Manual Trigger)

```bash
# Trigger Source 1 ingestion
POST /api/ingestion/trigger-source1

# Trigger Source 2 ingestion
POST /api/ingestion/trigger-source2

# Health check
GET /api/ingestion/health
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

## Extending with New Data Sources

### 1. Create a new adapter

```typescript
// src/modules/ingestion/adapters/source3.adapter.ts
import { Injectable } from '@nestjs/common'
import { BaseDataSourceAdapter } from './base.adapter'
import { UnifiedProperty } from '../../../shared/interfaces/unified-property.interface'

@Injectable()
export class Source3Adapter extends BaseDataSourceAdapter {
  validate(data: any): boolean {
    return !!(data.id && data.location && data.price)
  }

  transformToUnified(raw: any): UnifiedProperty {
    return {
      sourceId: 'source3',
      externalId: raw.id,
      city: raw.location.city,
      country: raw.location.country,
      availability: raw.isAvailable ?? false,
      pricePerNight: raw.price,
      sourceData: raw,
    }
  }
}
```

### 2. Register in config

```typescript
// src/config/s3.config.ts
export const INGESTION_SOURCES = {
  // ...existing sources...
  source3: {
    bucket: 'my-bucket',
    key: 'source3_data.json',
    enabled: true,
    schedule: '0 4 * * *', // 4 AM daily
  },
}
```

### 3. Add to Ingestion Module

```typescript
// src/modules/ingestion/ingestion.module.ts
import { Source3Adapter } from './adapters/source3.adapter'

@Module({
  // ...
  providers: [
    IngestionService,
    IngestionSchedulerService,
    Source1Adapter,
    Source2Adapter,
    Source3Adapter, // NEW
  ],
})
export class IngestionModule {}
```

### 4. Create scheduler method

```typescript
// src/modules/ingestion/services/ingestion-scheduler.service.ts
@Cron('0 4 * * *')
async scheduleSource3Ingestion() {
  const sourceConfig = INGESTION_SOURCES['source3']
  if (!sourceConfig.enabled) return

  try {
    const data = await this.s3Service.getObjectAsJSON(sourceConfig.bucket, sourceConfig.key)
    await this.ingestionService.ingestFromJSON(data, this.source3Adapter, 'source3')
  } catch (error) {
    this.logger.error(`Source 3 ingestion failed: ${error.message}`)
  }
}
```

Done! No other changes needed.

## Project Structure

```
src/
├── config/              # Configuration files
├── core/
│   ├── database/        # MongoDB setup
│   └── s3/              # S3 integration
├── modules/
│   ├── ingestion/       # Data ingestion logic
│   └── properties/      # Properties API
├── shared/              # Shared interfaces & types
└── app.module.ts        # Root module

test/
├── unit/                # Unit tests
└── e2e/                 # Integration tests
```

## Performance Considerations

- **Batch Processing**: Records inserted in batches of 1000
- **Indexing**: Strategic indexes on frequently queried fields
- **Streaming**: Large files processed as streams, not loaded into memory
- **Pagination**: All queries paginated (default 20 records)
- **Deduplication**: Upsert pattern prevents duplicates from re-ingestion