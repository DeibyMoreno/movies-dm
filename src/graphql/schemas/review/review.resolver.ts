import type { GraphQLContext } from '../../context.js';

export const reviewResolvers = {
  Query: {
    reviews: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      return [];
    },
    review: async (_parent: unknown, _args: { id: string }, _ctx: GraphQLContext) => {
      return null;
    },
  },
  Review: {
    user: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      return null;
    },
  },
};
