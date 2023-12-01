import { GraphQLBoolean, GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { ChangePostArgs, DeleteRecordArgs, MutationPostArgs } from './MutationArgsTypes.js';
import { PrismaClient } from '@prisma/client';

export const Post = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  })
});

const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    authorId: { type: UUIDType },
    content: { type: GraphQLString },
    title: { type: GraphQLString },
  })
});

const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    content: { type: GraphQLString },
    title: { type: GraphQLString },
  })
});

export const postMutations = {
  createPost: {
    type: Post,
    args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
    resolve: async (_: unknown, { dto }: MutationPostArgs, { prismaClient }: { prismaClient: PrismaClient }) => {
      return await prismaClient.post.create({ data: dto });
    }
  },
  deletePost: {
    type: GraphQLBoolean,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (_: unknown, { id }: DeleteRecordArgs, { prismaClient }: { prismaClient: PrismaClient }) => {
      try {
        await prismaClient.post.delete({ where: { id }});
        return true;
      } catch (error) {
        return false;
      }
    }
  },
  changePost: {
    type: Post,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(ChangePostInput) },
    },
    resolve: async (_: unknown, { id, dto }: ChangePostArgs, { prismaClient }: { prismaClient: PrismaClient }) => {
      return await prismaClient.post.update({ where: { id }, data: dto });
    }
  },
}
