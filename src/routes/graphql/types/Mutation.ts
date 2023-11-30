import { GraphQLNonNull, GraphQLObjectType, GraphQLBoolean } from 'graphql';
import { ChangePostInput, CreatePostInput, Post } from './Post.js';
import { PrismaClient } from '@prisma/client';
import { ChangeUserInput, CreateUserInput, User } from './User.js';
import { ChangeProfileInput, CreateProfileInput, Profile } from './Profile.js';
import { UUIDType } from './uuid.js';
import { MutationPostArgs, DeleteRecordArgs, ChangePostArgs, MutationUserArgs, ChangeUserArgs, MutationProfileArgs, ChangeProfileArgs, MutationSubscribe } from './MutationArgsTypes.js';

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
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
    createProfile: {
      type: Profile,
      args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
      resolve: async (_: unknown, { dto }: MutationProfileArgs, { prismaClient }: { prismaClient: PrismaClient }) => {
        return await prismaClient.profile.create({ data: dto });
      }
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_: unknown, { id }: DeleteRecordArgs, { prismaClient }: { prismaClient: PrismaClient }) => {
        try {
          await prismaClient.profile.delete({ where: { id }});
          return true;
        } catch (error) {
          return false;
        }
      }
    },
    changeProfile: {
      type: Profile,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (_: unknown, { id, dto }: ChangeProfileArgs, { prismaClient }: { prismaClient: PrismaClient }) => {
        return await prismaClient.profile.update({ where: { id }, data: dto });
      }
    },
    subscribeTo: {
      type: Profile,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_: unknown, { userId, authorId }: MutationSubscribe, { prismaClient }: { prismaClient: PrismaClient }) => {
        return await prismaClient.subscribersOnAuthors.create({ data: { authorId, subscriberId: userId }});
      }
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_: unknown, { userId, authorId }: MutationSubscribe, { prismaClient }: { prismaClient: PrismaClient }) => {
        try {
          await prismaClient.subscribersOnAuthors.delete({
             where: { 
              subscriberId_authorId: { 
                authorId, 
                subscriberId: userId 
              }
            }
          });
          return true;
        } catch (error) {
          return false;
        }
      }
    },
  }
});