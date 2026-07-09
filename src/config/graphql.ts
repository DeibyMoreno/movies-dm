import { GraphQLError, type GraphQLSchema } from 'graphql';
import { createYoga, type YogaServerOptions } from 'graphql-yoga';

import type { GraphQLContext } from '../graphql/context.js';
import { AppError } from '../lib/errors/AppError.js';
import { ValidationError } from '../lib/errors/ValidationError.js';

import { env } from './env.js';

type YogaOptions = Partial<YogaServerOptions<GraphQLContext, Record<string, unknown>>>;

export function createGraphQLServer(schema: GraphQLSchema, options?: YogaOptions) {
  return createYoga<GraphQLContext>({
    schema,
    graphqlEndpoint: '/graphql',
    graphiql: env.NODE_ENV !== 'production',
    landingPage: false,
    maskedErrors: {
      maskError: (error, message, isDev) => {
        const originalError = isGraphQLError(error)
          ? (error as GraphQLError).originalError ?? error
          : error;

        if (originalError instanceof AppError) {
          const extensions: Record<string, unknown> = {
            code: originalError.code,
            http: { status: originalError.statusCode },
          };

          if (originalError instanceof ValidationError && originalError.details) {
            extensions.details = originalError.details;
          }

          return new GraphQLError(originalError.message, { extensions });
        }

        return new GraphQLError(isDev ? message : 'Unexpected error.');
      },
      errorMessage: 'Unexpected error.',
      isDev: env.NODE_ENV !== 'production',
    },
    ...options,
  });
}

function isGraphQLError(error: unknown): error is GraphQLError {
  return error instanceof GraphQLError;
}

export type { YogaServerOptions };
