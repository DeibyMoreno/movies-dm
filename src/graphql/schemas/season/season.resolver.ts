import { NotFoundError } from '../../../lib/errors/NotFoundError.js';
import type { GraphQLContext } from '../../context.js';

export const seasonResolvers = {
  Query: {
    season: async (_parent: unknown, args: { id: string }, ctx: GraphQLContext) => {
      return ctx.di.seasonService.findById(args.id);
    },
  },
  Mutation: {
    createSeason: async (
      _parent: unknown,
      args: { input: { serieId: string; number: number; title?: string | null; releaseYear?: number | null } },
      ctx: GraphQLContext,
    ) => {
      return ctx.di.seasonService.create(args.input);
    },
    updateSeason: async (
      _parent: unknown,
      args: { id: string; input: { number?: number; title?: string | null; releaseYear?: number | null } },
      ctx: GraphQLContext,
    ) => {
      const season = await ctx.di.seasonService.update(args.id, args.input);
      if (!season) throw new NotFoundError('Season not found');
      return season;
    },
    deleteSeason: async (
      _parent: unknown,
      args: { id: string },
      ctx: GraphQLContext,
    ) => {
      const deleted = await ctx.di.seasonService.delete(args.id);
      if (!deleted) throw new NotFoundError('Season not found');
      return true;
    },
  },
  Season: {
    episodes: async (parent: { id: string }, _args: unknown, ctx: GraphQLContext) => {
      return ctx.di.episodeService.findBySeasonId(parent.id);
    },
  },
};
