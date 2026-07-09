import { NotFoundError } from '../../../lib/errors/NotFoundError.js';
import type { GraphQLContext } from '../../context.js';

export const episodeResolvers = {
  Query: {
    episode: async (_parent: unknown, args: { id: string }, ctx: GraphQLContext) => {
      return ctx.di.episodeService.findById(args.id);
    },
  },
  Mutation: {
    createEpisode: async (
      _parent: unknown,
      args: { input: { seasonId: string; number: number; title: string; synopsis?: string | null; durationMin?: number | null; releaseDate?: string | null; videoUrl?: string | null } },
      ctx: GraphQLContext,
    ) => {
      return ctx.di.episodeService.create(args.input);
    },
    updateEpisode: async (
      _parent: unknown,
      args: { id: string; input: { number?: number; title?: string; synopsis?: string | null; durationMin?: number | null; releaseDate?: string | null; videoUrl?: string | null } },
      ctx: GraphQLContext,
    ) => {
      const episode = await ctx.di.episodeService.update(args.id, args.input);
      if (!episode) throw new NotFoundError('Episode not found');
      return episode;
    },
    deleteEpisode: async (
      _parent: unknown,
      args: { id: string },
      ctx: GraphQLContext,
    ) => {
      const deleted = await ctx.di.episodeService.delete(args.id);
      if (!deleted) throw new NotFoundError('Episode not found');
      return true;
    },
  },
};
