import { Injectable, Logger } from '@nestjs/common';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'eu-north-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async getObjectStream(bucket: string, key: string): Promise<Readable> {
    try {
      this.logger.log(`Fetching S3 object: s3://${bucket}/${key}`);

      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      if (!response.Body) {
        throw new Error('No body in S3 response');
      }

      // AWS SDK v3 devuelve un ReadableStream que necesita ser convertido
      return response.Body as Readable;
    } catch (error) {
      this.logger.error(`Error fetching S3 object: ${error.message}`);
      throw error;
    }
  }

  async getObjectAsJSON(bucket: string, key: string): Promise<any[]> {
    try {
      this.logger.log(`Fetching JSON from S3: s3://${bucket}/${key}`);

      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      if (!response.Body) {
        throw new Error('No body in S3 response');
      }

      // Convertir stream a string
      const chunks: Buffer[] = [];
      const readable = response.Body as Readable;

      for await (const chunk of readable) {
        chunks.push(chunk);
      }

      const data = Buffer.concat(chunks).toString('utf-8');
      return JSON.parse(data);
    } catch (error) {
      this.logger.error(`Error fetching JSON from S3: ${error.message}`);
      throw error;
    }
  }
}
