import type { AuthService } from '../modules/auth/auth.service.js';
import type { GenreService } from '../modules/genre/genre.service.js';
import type { RoleService } from '../modules/role/role.service.js';
import type { UserService } from '../modules/user/user.service.js';
import type { AuthUser } from '../shared/types/index.js';

export interface DIContext {
  authService: AuthService;
  genreService: GenreService;
  roleService: RoleService;
  userService: UserService;
}

export interface GraphQLContext {
  user: AuthUser | null;
  di: DIContext;
}

export type GraphQLContextWithUser = GraphQLContext & { user: AuthUser };
