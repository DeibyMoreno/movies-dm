import type { GraphQLContext } from '../../context.js';

export const movieResolvers = {
  Query: {
    movies: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      return [];
    },
    movie: async (_parent: unknown, _args: { id?: string; slug?: string }, _ctx: GraphQLContext) => {
      return null;
    },
  },
  Movie: {
    genres: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      return [];
    },
    reviews: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      return [];
    },
  },
};
