import { NotFoundError } from '../../../lib/errors/NotFoundError.js';
import { parsePagination, type PaginationInput } from '../../../lib/helpers/pagination.js';
import type { GraphQLContext } from '../../context.js';

export const serieResolvers = {
  Query: {
    series: async (
      _parent: unknown,
      args: { pagination?: PaginationInput | null },
      ctx: GraphQLContext,
    ) => {
      const params = parsePagination(args.pagination);
      return ctx.di.serieService.findAll(params);
    },
    serie: async (
      _parent: unknown,
      args: { id: string; slug?: string | null },
      ctx: GraphQLContext,
    ) => {
      if (args.slug) {
        return ctx.di.serieService.findBySlug(args.slug);
      }
      return ctx.di.serieService.findById(args.id);
    },
  },
  Mutation: {
    createSerie: async (
      _parent: unknown,
      args: { input: { title: string; slug: string; synopsis?: string | null; releaseYear?: number | null; posterUrl?: string | null; backdropUrl?: string | null; status?: string | null; genreIds?: string[] | null } },
      ctx: GraphQLContext,
    ) => {
      const { genreIds, status, ...rest } = args.input;
      return ctx.di.serieService.create({ ...rest, status: (status ?? undefined) as 'ONGOING' | 'FINISHED' | 'CANCELED' | 'UPCOMING' | undefined, genreIds: genreIds ?? undefined });
    },
    updateSerie: async (
      _parent: unknown,
      args: { id: string; input: { title?: string; slug?: string; synopsis?: string | null; releaseYear?: number | null; posterUrl?: string | null; backdropUrl?: string | null; status?: string | null; genreIds?: string[] | null } },
      ctx: GraphQLContext,
    ) => {
      const { genreIds, status, ...rest } = args.input;
      const serie = await ctx.di.serieService.update(args.id, { ...rest, status: (status ?? undefined) as 'ONGOING' | 'FINISHED' | 'CANCELED' | 'UPCOMING' | undefined, genreIds: genreIds ?? undefined });
      if (!serie) throw new NotFoundError('Serie not found');
      return serie;
    },
    deleteSerie: async (
      _parent: unknown,
      args: { id: string },
      ctx: GraphQLContext,
    ) => {
      const deleted = await ctx.di.serieService.delete(args.id);
      if (!deleted) throw new NotFoundError('Serie not found');
      return true;
    },
  },
  Serie: {
    genres: async (parent: { id: string }, _args: unknown, ctx: GraphQLContext) => {
      return ctx.di.genreService.findBySerieId(parent.id);
    },
    seasons: async (parent: { id: string }, _args: unknown, ctx: GraphQLContext) => {
      return ctx.di.seasonService.findBySerieId(parent.id);
    },
    reviews: async (parent: { id: string }, _args: unknown, ctx: GraphQLContext) => {
      return ctx.di.reviewService.findBySerieId(parent.id, { limit: 20, offset: 0 });
    },
  },
};
