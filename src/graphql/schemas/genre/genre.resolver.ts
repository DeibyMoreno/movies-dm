import type { GraphQLContext } from '../../context.js';

export const genreResolvers = {
  Query: {
    genres: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      return ctx.di.genreService.findAll();
    },
    genre: async (_parent: unknown, args: { id: string }, ctx: GraphQLContext) => {
      return ctx.di.genreService.findById(args.id);
    },
  },
  Mutation: {
    createGenre: async (
      _parent: unknown,
      args: { input: { name: string; slug: string } },
      ctx: GraphQLContext,
    ) => {
      return ctx.di.genreService.create(args.input);
    },
  },
  Genre: {
    movies: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      return [];
    },
    series: async (_parent: unknown, _args: unknown, _ctx: GraphQLContext) => {
      return [];
    },
  },
};
