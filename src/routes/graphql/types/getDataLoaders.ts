import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';
import { DataLoaders } from './graphql.type.js';

const getDataLoaders = (prismaClient: PrismaClient): DataLoaders => {
  async function batchGetMemberType(ids: readonly string[]) {
    return await prismaClient.memberType.findMany({ where: { id: { in: ids as string[] } }});
  }

  const memberTypeLoader = new DataLoader(async (ids: readonly string[]) => await batchGetMemberType(ids));

  async function batchGetProfile(ids: readonly string[]) {
    const profilesArr = await prismaClient.profile.findMany({ where: { userId: { in: ids as string[]} }});
    const profilesByIds = ids.map((id) => profilesArr.find((profile) => profile.userId === id));
    return profilesByIds;
  }

  const profileLoader = new DataLoader(async (ids: readonly string[]) => await batchGetProfile(ids));

  async function batchGetPosts(ids: readonly string[]) {
    const postsArr = await prismaClient.post.findMany({ where: { authorId: { in: ids as string[] } }});
    const postsByIds = ids.map((id) => postsArr.filter((post) => post.authorId === id));
    return postsByIds;
  }

  const postLoader = new DataLoader(async (ids: readonly string[]) => await batchGetPosts(ids));

  async function batchGetUserSubscribedTo(ids: readonly string[]) {
    const usersArr = await prismaClient.user.findMany({
      where: {
        subscribedToUser: {
          some: {
            subscriberId: {
              in: ids as string[],
            }
          }
        }
      }
    });

    return ids.map(() => usersArr);
  }

  const userSubscribedToLoader = new DataLoader(async (ids: readonly string[]) => await batchGetUserSubscribedTo(ids));

  async function batchGetSubscribedToUser(ids: readonly string[]) {
    const usersArr = await prismaClient.user.findMany({
      where: {
        userSubscribedTo: {
          some: {
            authorId: {
              in: ids as string[],
            }
          }
        }
      }
    });

    return ids.map(() => usersArr);
  }

  const subscribedToUserLoader = new DataLoader(async (ids: readonly string[]) => await batchGetSubscribedToUser(ids));

  const dataLoaders: DataLoaders = {
    memberTypeLoader,
    profileLoader,
    postLoader,
    userSubscribedToLoader,
    subscribedToUserLoader,
  };

  return dataLoaders;
}

export default getDataLoaders;
