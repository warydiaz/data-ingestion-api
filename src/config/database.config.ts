import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getMongooseConfig = (): MongooseModuleOptions => ({
  uri: process.env.MONGODB_URI!,
});
