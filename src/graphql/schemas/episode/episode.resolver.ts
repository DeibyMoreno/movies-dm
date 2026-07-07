import type { GraphQLContext } from '../../context.js';

export const episodeResolvers = {
  Query: {
    episode: async (_parent: unknown, _args: { id: string }, _ctx: GraphQLContext) => {
      return null;
    },
  },
};
