import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface S3SourceConfig {
  bucket: string;
  key: string;
  enabled: boolean;
  schedule?: string;
}

@Injectable()
export class S3ConfigService {
  constructor(private configService: ConfigService) {}

  getIngestionSources(): Record<string, S3SourceConfig> {
    return {
      source1: {
        bucket: this.configService.get<string>('S3_BUCKET_1')!,
        key: this.configService.get<string>('S3_SOURCE1_KEY')!,
        enabled: true,
        schedule: '0 2 * * *', // 2 AM daily
      },
      source2: {
        bucket: this.configService.get<string>('S3_BUCKET_2')!,
        key: this.configService.get<string>('S3_SOURCE2_KEY')!,
        enabled: true,
        schedule: '0 3 * * 0', // Sunday 3 AM
      },
    };
  }

  getSourceConfig(sourceId: string): S3SourceConfig | null {
    const sources = this.getIngestionSources();
    return sources[sourceId] || null;
  }
}
