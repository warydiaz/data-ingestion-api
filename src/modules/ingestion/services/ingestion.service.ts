/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, Logger } from '@nestjs/common';
import { Readable } from 'stream';
import { PropertiesRepository } from '../../properties/repositories/properties.repository';
import { BaseDataSourceAdapter } from '../adapters/base.adapter';
import { UnifiedProperty } from '../../../shared/interfaces/unified-property.interface';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(private propertiesRepository: PropertiesRepository) {}

  async ingestFromStream(
    stream: Readable,
    adapter: BaseDataSourceAdapter,
    sourceName: string,
  ): Promise<{ processed: number; successful: number; failed: number }> {
    let buffer = '';
    let processed = 0;
    let successful = 0;
    let failed = 0;
    let batch: UnifiedProperty[] = [];
    const BATCH_SIZE = 1000;

    try {
      // Simular streaming JSON parsing
      for await (const chunk of stream) {
        buffer += chunk.toString();

        // Intentar parsear líneas JSON completas
        const lines = buffer.split('\n');
        buffer = lines[lines.length - 1];

        for (let i = 0; i < lines.length - 1; i++) {
          try {
            const line = lines[i].trim();
            if (!line) continue;

            // Manejar arrays JSON grandes
            if (line.startsWith('[') || line.startsWith(']') || line === ',') {
              continue;
            }

            let jsonObj = line.replace(/,$/, '');
            if (jsonObj.startsWith('{') && jsonObj.endsWith('}')) {
              jsonObj = JSON.parse(jsonObj);

              if (adapter.validate(jsonObj)) {
                const unified = adapter.transformToUnified(jsonObj);
                batch.push(unified);
                successful++;
              } else {
                failed++;
              }

              processed++;

              if (batch.length >= BATCH_SIZE) {
                await this.propertiesRepository.insertMany(batch);
                this.logger.debug(`Inserted batch of ${batch.length} records`);
                batch = [];
              }
            }
          } catch (e) {
            failed++;
            this.logger.warn(`Failed to parse line: ${e.message}`);
          }
        }
      }

      // Insertar último batch
      if (batch.length > 0) {
        await this.propertiesRepository.insertMany(batch);
        this.logger.debug(`Inserted final batch of ${batch.length} records`);
      }

      this.logger.log(
        `Ingestion completed for ${sourceName}: ${processed} processed, ${successful} successful, ${failed} failed`,
      );

      return { processed, successful, failed };
    } catch (error) {
      this.logger.error(`Error during ingestion: ${error.message}`);
      throw error;
    }
  }

  async ingestFromJSON(
    data: any[],
    adapter: BaseDataSourceAdapter,
    sourceName: string,
  ): Promise<{ processed: number; successful: number; failed: number }> {
    let processed = 0;
    let successful = 0;
    let failed = 0;
    let batch: UnifiedProperty[] = [];
    const BATCH_SIZE = 1000;

    try {
      for (const item of data) {
        try {
          if (adapter.validate(item)) {
            const unified = adapter.transformToUnified(item);
            batch.push(unified);
            successful++;
          } else {
            failed++;
          }

          processed++;

          if (batch.length >= BATCH_SIZE) {
            await this.propertiesRepository.insertMany(batch);
            this.logger.debug(`Inserted batch of ${batch.length} records`);
            batch = [];
          }
        } catch (e) {
          failed++;
          this.logger.warn(`Failed to process item: ${e.message}`);
        }
      }

      // Insertar último batch
      if (batch.length > 0) {
        await this.propertiesRepository.insertMany(batch);
        this.logger.debug(`Inserted final batch of ${batch.length} records`);
      }

      this.logger.log(
        `Ingestion completed for ${sourceName}: ${processed} processed, ${successful} successful, ${failed} failed`,
      );

      return { processed, successful, failed };
    } catch (error) {
      this.logger.error(`Error during ingestion: ${error.message}`);
      throw error;
    }
  }
}
