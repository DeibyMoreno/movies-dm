import { UnauthorizedError } from '../../../lib/errors/UnauthorizedError.js';
import { parsePagination, type PaginationInput } from '../../../lib/helpers/pagination.js';
import type { GraphQLContext } from '../../context.js';

export const userResolvers = {
  Query: {
    users: async (
      _parent: unknown,
      args: { pagination?: PaginationInput | null },
      ctx: GraphQLContext,
    ) => {
      const params = parsePagination(args.pagination);
      return ctx.di.userService.findAll(params);
    },
    user: async (_parent: unknown, args: { id: string }, ctx: GraphQLContext) => {
      return ctx.di.userService.findById(args.id);
    },
    me: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      if (!ctx.user) throw new UnauthorizedError('Authentication required');
      return ctx.di.userService.findById(ctx.user.id);
    },
  },
  User: {
    reviews: async (
      parent: { id: string },
      args: { pagination?: PaginationInput | null },
      ctx: GraphQLContext,
    ) => {
      const params = parsePagination(args.pagination);
      return ctx.di.reviewService.findByUserId(parent.id, params);
    },
    favorites: async (
      parent: { id: string },
      args: { pagination?: PaginationInput | null },
      ctx: GraphQLContext,
    ) => {
      const params = parsePagination(args.pagination);
      return ctx.di.favoriteService.findByUserId(parent.id, params);
    },
  },
};
