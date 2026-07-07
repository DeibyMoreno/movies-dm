import type { GraphQLContext } from '../../context.js';

export const serieResolvers = {
  Query: {
    series: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      return [];
    },
    serie: async (_parent: unknown, _args: { id?: string; slug?: string }, _ctx: GraphQLContext) => {
      return null;
    },
  },
  Serie: {
    genres: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      return [];
    },
    seasons: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      return [];
    },
    reviews: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      return [];
    },
  },
};
