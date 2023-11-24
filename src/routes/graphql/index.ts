import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlMainSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';

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

      return await graphql({
        schema: gqlMainSchema,
        source: query,
        variableValues: variables,
        contextValue: { prismaClient: fastify.prisma },
      });
    },
  });
};

export default plugin;
