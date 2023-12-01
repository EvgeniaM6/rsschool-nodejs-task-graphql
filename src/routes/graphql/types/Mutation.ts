import { GraphQLObjectType } from 'graphql';
import { postMutations } from './Post.js';
import { userMutations } from './User.js';
import { profileMutations } from './Profile.js';
import { subscribeMutations } from './Subscribe.js';

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...postMutations,
    ...userMutations,
    ...profileMutations,
    ...subscribeMutations,
  }
});