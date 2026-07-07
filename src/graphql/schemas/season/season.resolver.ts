import type { GraphQLContext } from '../../context.js';

export const seasonResolvers = {
  Query: {
    season: async (_parent: unknown, _args: { id: string }, _ctx: GraphQLContext) => {
      return null;
    },
  },
  Season: {
    episodes: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      return [];
    },
  },
};
