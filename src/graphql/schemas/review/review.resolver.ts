import { NotFoundError } from '../../../lib/errors/NotFoundError.js';
import { UnauthorizedError } from '../../../lib/errors/UnauthorizedError.js';
import { parsePagination, type PaginationInput } from '../../../lib/helpers/pagination.js';
import type { GraphQLContext } from '../../context.js';

export const reviewResolvers = {
  Query: {
    reviews: async (
      _parent: unknown,
      args: { movieId?: string | null; serieId?: string | null; pagination?: PaginationInput | null },
      ctx: GraphQLContext,
    ) => {
      const params = parsePagination(args.pagination);

      if (args.movieId) {
        return ctx.di.reviewService.findByMovieId(args.movieId, params);
      }
      if (args.serieId) {
        return ctx.di.reviewService.findBySerieId(args.serieId, params);
      }

      return ctx.di.reviewService.findAll(params);
    },
    review: async (_parent: unknown, args: { id: string }, ctx: GraphQLContext) => {
      return ctx.di.reviewService.findById(args.id);
    },
  },
  Mutation: {
    createReview: async (
      _parent: unknown,
      args: { input: { movieId?: string | null; serieId?: string | null; rating: number; comment?: string | null } },
      ctx: GraphQLContext,
    ) => {
      if (!ctx.user) throw new UnauthorizedError('Authentication required');
      return ctx.di.reviewService.create({ ...args.input, userId: ctx.user.id });
    },
    updateReview: async (
      _parent: unknown,
      args: { id: string; input: { rating?: number; comment?: string | null } },
      ctx: GraphQLContext,
    ) => {
      const review = await ctx.di.reviewService.update(args.id, args.input);
      if (!review) throw new NotFoundError('Review not found');
      return review;
    },
    deleteReview: async (
      _parent: unknown,
      args: { id: string },
      ctx: GraphQLContext,
    ) => {
      const deleted = await ctx.di.reviewService.delete(args.id);
      if (!deleted) throw new NotFoundError('Review not found');
      return true;
    },
  },
  Review: {
    user: async (parent: { userId: string }, _args: unknown, ctx: GraphQLContext) => {
      const user = await ctx.di.userService.findById(parent.userId);
      if (!user) throw new NotFoundError('User not found');
      return user;
    },
  },
};
