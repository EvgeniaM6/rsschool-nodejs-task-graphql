import { PrismaClient } from '@prisma/client';
import { GraphQLList, GraphQLObjectType } from 'graphql';
import { MemberType, MemberTypeIdEnum } from './MemberType.js';
import { Post } from './Post.js';
import { UUIDType } from './uuid.js';
import { User } from './User.js';
import { Profile } from './Profile.js';

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_: unknown, args: unknown, context: { prismaClient: PrismaClient }) => {
        return await context.prismaClient.memberType.findMany();
      }
    },
    memberType: {
      type: MemberType,
      args: { id: { type: MemberTypeIdEnum } },
      resolve: async (_: unknown, args: { id: string }, context: { prismaClient: PrismaClient }) => {
        return await context.prismaClient.memberType.findUnique({ where: { id: args.id }});
      }
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: async (_: unknown, args: unknown, context: { prismaClient: PrismaClient }) => {
        return await context.prismaClient.post.findMany();
      }
    },
    post: {
      type: Post,
      args: { id: { type: UUIDType } },
      resolve: async (_: unknown, args: { id: string }, context: { prismaClient: PrismaClient }) => {
        return await context.prismaClient.post.findUnique({ where: { id: args.id }});
      }
    },
    users: {
      type: new GraphQLList(User),
      resolve: async (_: unknown, args: unknown, context: { prismaClient: PrismaClient }) => {
        return await context.prismaClient.user.findMany();
      }
    },
    user: {
      type: User,
      args: { id: { type: UUIDType } },
      resolve: async (_: unknown, args: { id: string }, context: { prismaClient: PrismaClient }) => {
        return await context.prismaClient.user.findUnique({ where: { id: args.id }});
      }
    },
    profiles: {
      type: new GraphQLList(Profile),
      resolve: async (_: unknown, args: unknown, context: { prismaClient: PrismaClient }) => {
        return await context.prismaClient.profile.findMany();
      }
    },
    profile: {
      type: Profile,
      args: { id: { type: UUIDType } },
      resolve: async (_: unknown, args: { id: string }, context: { prismaClient: PrismaClient }) => {
        return await context.prismaClient.profile.findUnique({ where: { id: args.id }});
      }
    },
  }
});
