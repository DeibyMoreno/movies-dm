import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import type { GraphQLSchema } from 'graphql';

import { UnauthorizedError } from '../../lib/errors/UnauthorizedError.js';

export function authDirectiveTransformer(schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, 'auth')?.[0];

      if (authDirective) {
        const { resolve: originalResolve } = fieldConfig;

        fieldConfig.resolve = async (source, args, context, info) => {
          if (!context.user) {
            throw new UnauthorizedError('Authentication required');
          }

          if (authDirective.role && context.user.role !== authDirective.role) {
            throw new UnauthorizedError('Insufficient permissions');
          }

          if (originalResolve) {
            return originalResolve(source, args, context, info);
          }

          return undefined;
        };
      }

      return fieldConfig;
    },
  });
}
