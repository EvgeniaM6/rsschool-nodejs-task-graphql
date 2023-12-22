import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeIdEnum } from './MemberType.js';
import { PrismaClient } from '@prisma/client';
import { ChangeProfileArgs, DeleteRecordArgs, MutationProfileArgs } from './MutationArgsTypes.js';
import { GraphQLContext } from './graphql.type.js';

export const Profile = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeIdEnum },
    memberType: {
      type: MemberType,
      resolve: async (parent: { memberTypeId: string }, _, { dataLoaders }: GraphQLContext) => {
        return await dataLoaders.memberTypeLoader.load(parent.memberTypeId);
      }
    }
  })
});

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeIdEnum },
  })
});

const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdEnum },
  })
});
;

export const profileMutations = {
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
}
