import { parsePagination, type PaginationInput } from '../../../lib/helpers/pagination.js';
import type { GraphQLContext } from '../../context.js';

export const roleResolvers = {
  Query: {
    roles: async (
      _parent: unknown,
      args: { pagination?: PaginationInput | null },
      ctx: GraphQLContext,
    ) => {
      const params = parsePagination(args.pagination);

      return ctx.di.roleService.findAll(params);
    },
    role: async (_parent: unknown, args: { id: string }, ctx: GraphQLContext) => {
      return ctx.di.roleService.findById(args.id);
    },
  },
  Mutation: {
    createRole: async (
      _parent: unknown,
      args: { input: { name: string; description?: string | null } },
      ctx: GraphQLContext,
    ) => {
      return ctx.di.roleService.create(args.input);
    },
  },
};
