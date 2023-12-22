import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

export type GraphQLContext = {
  prismaClient: PrismaClient,
  dataLoaders: DataLoaders
}

export type DataLoaders = {
  [key: string]: DataLoader<unknown, unknown, unknown>
}
