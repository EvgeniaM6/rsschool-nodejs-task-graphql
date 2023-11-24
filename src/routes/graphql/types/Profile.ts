import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeIdEnum } from './MemberType.js';
import { PrismaClient } from '@prisma/client';

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
      resolve: async (parent: { memberTypeId: string }, args, context: { prismaClient: PrismaClient }) => {
        return await context.prismaClient.memberType.findUnique({ where: { id: parent.memberTypeId }})
      }
    }
  })
});
