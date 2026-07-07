import type { GraphQLContext } from '../../context.js';

export const authResolvers = {
  Mutation: {
    login: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      throw new Error('Not implemented');
    },
    register: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      throw new Error('Not implemented');
    },
  },
};
