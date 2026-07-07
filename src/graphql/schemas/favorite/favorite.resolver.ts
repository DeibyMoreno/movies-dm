import type { GraphQLContext } from '../../context.js';

export const favoriteResolvers = {
  Query: {
    favorites: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      return [];
    },
  },
  Favorite: {
    movie: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      return null;
    },
    serie: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      return null;
    },
    user: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      return null;
    },
  },
};
