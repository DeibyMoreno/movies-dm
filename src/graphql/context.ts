import type { GenreService } from '../modules/genre/genre.service.js';
import type { RoleService } from '../modules/role/role.service.js';
import type { AuthUser } from '../shared/types/index.js';

export interface DIContext {
  genreService: GenreService;
  roleService: RoleService;
}

export interface GraphQLContext {
  user: AuthUser | null;
  di: DIContext;
}

export type GraphQLContextWithUser = GraphQLContext & { user: AuthUser };
