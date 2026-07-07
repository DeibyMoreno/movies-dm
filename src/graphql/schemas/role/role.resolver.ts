import type { GraphQLContext } from '../../context.js';

export const roleResolvers = {
  Query: {
    roles: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      return [];
    },
    role: async (_parent: unknown, _args: { id: string }, _ctx: GraphQLContext) => {
      return null;
    },
  },
};
