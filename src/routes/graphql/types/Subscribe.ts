import { GraphQLBoolean, GraphQLNonNull } from "graphql";
import { Profile } from "./Profile.js";
import { UUIDType } from "./uuid.js";
import { MutationSubscribe } from "./MutationArgsTypes.js";
import { PrismaClient } from "@prisma/client";

export const subscribeMutations = {
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