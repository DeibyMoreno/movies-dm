import type { GraphQLContext } from '../../context.js';

export const userResolvers = {
  Query: {
    users: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      return [];
    },
    user: async (_parent: unknown, _args: { id: string }, _ctx: GraphQLContext) => {
      return null;
    },
    me: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      if (!ctx.user) return null;
      return ctx.user;
    },
  },
  User: {
    reviews: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      return [];
    },
    favorites: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      return [];
    },
  },
};
