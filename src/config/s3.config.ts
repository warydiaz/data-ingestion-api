export interface S3SourceConfig {
  bucket: string;
  key: string;
  enabled: boolean;
  schedule?: string;
}

export const INGESTION_SOURCES: Record<string, S3SourceConfig> = {
  source1: {
    bucket: process.env.S3_BUCKET!,
    key: process.env.S3_SOURCE1_KEY!,
    enabled: true,
    schedule: '0 2 * * *', // 2 AM daily
  },
  source2: {
    bucket: process.env.S3_BUCKET!,
    key: process.env.S3_SOURCE2_KEY!,
    enabled: true,
    schedule: '0 3 * * 0', // Sunday 3 AM
  },
};
