import type { GraphQLSchema } from 'graphql';
import { createYoga, type YogaServerOptions } from 'graphql-yoga';

import type { GraphQLContext } from '../graphql/context.js';

type YogaOptions = Partial<YogaServerOptions<GraphQLContext, Record<string, unknown>>>;

export function createGraphQLServer(schema: GraphQLSchema, options?: YogaOptions) {
  return createYoga<GraphQLContext>({
    schema,
    graphqlEndpoint: '/graphql',
    graphiql: process.env.NODE_ENV !== 'production',
    landingPage: false,
    ...options,
  });
}
