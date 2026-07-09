import { NotFoundError } from '../../../lib/errors/NotFoundError.js';
import { parsePagination, type PaginationInput } from '../../../lib/helpers/pagination.js';
import type { GraphQLContext } from '../../context.js';

export const movieResolvers = {
  Query: {
    movies: async (
      _parent: unknown,
      args: { pagination?: PaginationInput | null },
      ctx: GraphQLContext,
    ) => {
      const params = parsePagination(args.pagination);
      return ctx.di.movieService.findAll(params);
    },
    movie: async (
      _parent: unknown,
      args: { id: string; slug?: string | null },
      ctx: GraphQLContext,
    ) => {
      if (args.slug) {
        return ctx.di.movieService.findBySlug(args.slug);
      }
      return ctx.di.movieService.findById(args.id);
    },
  },
  Mutation: {
    createMovie: async (
      _parent: unknown,
      args: { input: { title: string; slug: string; synopsis?: string | null; releaseYear?: number | null; durationMin?: number | null; posterUrl?: string | null; backdropUrl?: string | null; genreIds?: string[] | null } },
      ctx: GraphQLContext,
    ) => {
      const { genreIds, ...rest } = args.input;
      return ctx.di.movieService.create({ ...rest, genreIds: genreIds ?? undefined });
    },
    updateMovie: async (
      _parent: unknown,
      args: { id: string; input: { title?: string; slug?: string; synopsis?: string | null; releaseYear?: number | null; durationMin?: number | null; posterUrl?: string | null; backdropUrl?: string | null; genreIds?: string[] | null } },
      ctx: GraphQLContext,
    ) => {
      const { genreIds, ...rest } = args.input;
      const movie = await ctx.di.movieService.update(args.id, { ...rest, genreIds: genreIds ?? undefined });
      if (!movie) throw new NotFoundError('Movie not found');
      return movie;
    },
    deleteMovie: async (
      _parent: unknown,
      args: { id: string },
      ctx: GraphQLContext,
    ) => {
      const deleted = await ctx.di.movieService.delete(args.id);
      if (!deleted) throw new NotFoundError('Movie not found');
      return true;
    },
  },
  Movie: {
    genres: async (parent: { id: string }, _args: unknown, ctx: GraphQLContext) => {
      return ctx.di.genreService.findByMovieId(parent.id);
    },
    reviews: async (parent: { id: string }, _args: unknown, ctx: GraphQLContext) => {
      return ctx.di.reviewService.findByMovieId(parent.id, { limit: 20, offset: 0 });
    },
  },
};
