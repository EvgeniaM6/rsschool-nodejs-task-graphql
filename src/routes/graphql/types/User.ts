import { GraphQLFloat, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInputObjectType, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import { UUIDType } from './uuid.js';
import { Profile } from './Profile.js';
import { Post } from './Post.js';
import { PrismaClient } from '@prisma/client';
import { ChangeUserArgs, DeleteRecordArgs, MutationUserArgs } from './MutationArgsTypes.js';
import { GraphQLContext } from './graphql.type.js';

export const User: GraphQLObjectType<{ id: string }, GraphQLContext> = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: Profile,
      resolve: async (parent: { id: string }, _: unknown, { dataLoaders }: GraphQLContext) => {
        return await dataLoaders.profileLoader.load(parent.id);
      }
    },
    posts: { 
      type: new GraphQLList(Post),
      resolve: async (parent: { id: string }, _: unknown, { dataLoaders }: GraphQLContext) => {
        return await dataLoaders.postLoader.load(parent.id);
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(User),
      resolve: async (parent: { id: string }, _: unknown, { dataLoaders }: GraphQLContext) => {
        return await dataLoaders.userSubscribedToLoader.load(parent.id);
      }
    },
    subscribedToUser: {
      type: new GraphQLList(User),
      resolve: async (parent: { id: string }, _: unknown, { dataLoaders }: GraphQLContext) => {
        return await dataLoaders.subscribedToUserLoader.load(parent.id);
      }
    }
  })
});

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  })
});

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  })
});;

export const userMutations = {
  createUser: {
    type: User,
    args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
    resolve: async (_: unknown, { dto }: MutationUserArgs, { prismaClient }: { prismaClient: PrismaClient }) => {
      return await prismaClient.user.create({ data: dto });
    }
  },
  deleteUser: {
    type: GraphQLBoolean,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (_: unknown, { id }: DeleteRecordArgs, { prismaClient }: { prismaClient: PrismaClient }) => {
      try {
        await prismaClient.user.delete({ where: { id }});
        return true;
      } catch (error) {
        return false;
      }
    }
  },
  changeUser: {
    type: User,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(ChangeUserInput) },
    },
    resolve: async (_: unknown, { id, dto }: ChangeUserArgs, { prismaClient }: { prismaClient: PrismaClient }) => {
      return await prismaClient.user.update({ where: { id }, data: dto });
    }
  },
}
