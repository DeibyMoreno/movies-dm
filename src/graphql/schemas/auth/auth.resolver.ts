import type { GraphQLContext } from '../../context.js';

export interface LoginArgs {
  input: { email: string; password: string };
}

export interface RegisterArgs {
  input: { email: string; password: string; name: string };
}

export const authResolvers = {
  Mutation: {
    login: async (
      _parent: unknown,
      args: LoginArgs,
      ctx: GraphQLContext,
    ) => {
      return ctx.di.authService.login(args.input.email, args.input.password);
    },
    register: async (
      _parent: unknown,
      args: RegisterArgs,
      ctx: GraphQLContext,
    ) => {

      return ctx.di.authService.register(
        args.input.email,
        args.input.password,
        args.input.name,
      );
    },
  },
};
