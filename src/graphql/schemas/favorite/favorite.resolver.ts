import { UnauthorizedError } from '../../../lib/errors/UnauthorizedError.js';
import { parsePagination, type PaginationInput } from '../../../lib/helpers/pagination.js';
import type { GraphQLContext } from '../../context.js';

export const favoriteResolvers = {
  Query: {
    favorites: async (
      _parent: unknown,
      args: { pagination?: PaginationInput | null },
      ctx: GraphQLContext,
    ) => {
      if (!ctx.user) throw new UnauthorizedError('Authentication required');
      const params = parsePagination(args.pagination);
      return ctx.di.favoriteService.findByUserId(ctx.user.id, params);
    },
  },
  Mutation: {
    toggleFavorite: async (
      _parent: unknown,
      args: { input: { movieId?: string | null; serieId?: string | null } },
      ctx: GraphQLContext,
    ) => {
      if (!ctx.user) throw new UnauthorizedError('Authentication required');
      return ctx.di.favoriteService.toggle({
        userId: ctx.user.id,
        movieId: args.input.movieId,
        serieId: args.input.serieId,
      });
    },
  },
  Favorite: {
    movie: async (parent: { movieId: string | null }, _args: unknown, ctx: GraphQLContext) => {
      if (!parent.movieId) return null;
      return ctx.di.movieService.findById(parent.movieId);
    },
    serie: async (parent: { serieId: string | null }, _args: unknown, ctx: GraphQLContext) => {
      if (!parent.serieId) return null;
      return ctx.di.serieService.findById(parent.serieId);
    },
    user: async (parent: { userId: string }, _args: unknown, ctx: GraphQLContext) => {
      return ctx.di.userService.findById(parent.userId);
    },
  },
};
