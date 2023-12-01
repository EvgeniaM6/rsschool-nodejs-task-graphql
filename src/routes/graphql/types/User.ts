import { GraphQLFloat, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInputObjectType, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import { UUIDType } from './uuid.js';
import { Profile } from './Profile.js';
import { Post } from './Post.js';
import { PrismaClient } from '@prisma/client';
import { ChangeUserArgs, DeleteRecordArgs, MutationUserArgs } from './MutationArgsTypes.js';

export const User: GraphQLObjectType<{
  id: string;
}, {
  prismaClient: PrismaClient;
}> = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: Profile,
      resolve: async (parent: { id: string }, _: unknown, context: { prismaClient: PrismaClient }) => {
          return await context.prismaClient.profile.findUnique({ where: { userId: parent.id }});
      }
    },
    posts: { 
      type: new GraphQLList(Post),
      resolve: async (parent: { id: string }, _: unknown, context: { prismaClient: PrismaClient }) => {
        return await context.prismaClient.post.findMany({ where: { authorId: parent.id }});
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(User),
      resolve: async (parent: { id: string }, _: unknown, context: { prismaClient: PrismaClient }) => {
        return await context.prismaClient.user.findMany({ where: { subscribedToUser: { some: { subscriberId: parent.id } } }});
      }
    },
    subscribedToUser: {
      type: new GraphQLList(User),
      resolve: async (parent: { id: string }, _: unknown, context: { prismaClient: PrismaClient }) => {
        return await context.prismaClient.user.findMany({ where: { userSubscribedTo: { some: { authorId: parent.id } } }});
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
