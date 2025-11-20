import { Source1Adapter } from 'src/modules/ingestion/adapters/source1.adapter';
import { Source2Adapter } from 'src/modules/ingestion/adapters/source2.adapter';

export const INGESTION_SOURCES = {
  source1: {
    bucket: process.env.S3_BUCKET_1,
    key: 'structured_generated_data.json',
    adapter: Source1Adapter,
    schedule: '0 2 * * *', // 2 AM daily
    enabled: true,
  },
  source2: {
    bucket: process.env.S3_BUCKET_2,
    key: 'large_generated_data.json',
    adapter: Source2Adapter,
    schedule: '0 3 * * 0', // Sunday 3 AM
    enabled: true,
  },
};
