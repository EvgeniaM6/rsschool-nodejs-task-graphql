import { GraphQLFloat, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { Profile } from './Profile.js';
import { Post } from './Post.js';
import { PrismaClient } from '@prisma/client';

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

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  })
});
