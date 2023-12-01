import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlMainSchema, gqlResponseSchema } from './schemas.js';
import { graphql, validate, parse, GraphQLError } from 'graphql';
import depthLimit from 'graphql-depth-limit';

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
