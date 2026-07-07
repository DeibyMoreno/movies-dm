import type { GenreService } from '../modules/genre/genre.service.js';
import type { AuthUser } from '../shared/types/index.js';

export interface DIContext {
  genreService: GenreService;
}

export interface GraphQLContext {
  user: AuthUser | null;
  di: DIContext;
}

export type GraphQLContextWithUser = GraphQLContext & { user: AuthUser };
