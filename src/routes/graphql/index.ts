import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlMainSchema, gqlResponseSchema } from './schemas.js';
import { graphql, validate, parse, GraphQLError } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import getDataLoaders from './types/getDataLoaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      const errors: readonly GraphQLError[] = validate(gqlMainSchema, parse(query), [depthLimit(5)]);
      if (errors.length > 0) {
        return {
          data: null,
          errors,
        }
      }

      const { prisma } = fastify;

      return await graphql({
        schema: gqlMainSchema,
        source: query,
        variableValues: variables,
        contextValue: { prismaClient: prisma, dataLoaders: getDataLoaders(prisma) },
      });
    },
  });
};

export default plugin;
