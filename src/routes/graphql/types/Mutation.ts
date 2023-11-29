import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { CreatePostInput, Post } from './Post.js';
import { PrismaClient } from '@prisma/client';
import { CreateUserInput, User } from './User.js';
import { CreateProfileInput, Profile } from './Profile.js';

type CreatePostInputType = { content: string, title: string, authorId: string };
type CreateUserInputType = { name: string, balance: number };
type CreateProfileInputType = { isMale: boolean, yearOfBirth: number, userId: string, memberTypeId: string };

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: Post,
      args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
      resolve: async (_: unknown, { dto }: { dto: CreatePostInputType }, context: { prismaClient: PrismaClient }) => {
        console.log('createPost');
        console.log('dto=', dto);
        return await context.prismaClient.post.create({ data: dto });
      }
    },
    createUser: {
      type: User,
      args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
      resolve: async (_: unknown, { dto }: { dto: CreateUserInputType }, context: { prismaClient: PrismaClient }) => {
        console.log('createUser');
        console.log('dto=', dto);
        return await context.prismaClient.user.create({ data: dto });
      }
    },
    createProfile: {
      type: Profile,
      args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
      resolve: async (_: unknown, { dto }: { dto: CreateProfileInputType }, context: { prismaClient: PrismaClient }) => {
        console.log('createProfile');
        console.log('dto=', dto);
        return await context.prismaClient.profile.create({ data: dto });
      }
    },
  }
});