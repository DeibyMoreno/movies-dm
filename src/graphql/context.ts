import type { AuthService } from '../modules/auth/auth.service.js';
import type { EpisodeService } from '../modules/episode/episode.service.js';
import type { FavoriteService } from '../modules/favorite/favorite.service.js';
import type { GenreService } from '../modules/genre/genre.service.js';
import type { MovieService } from '../modules/movie/movie.service.js';
import type { ReviewService } from '../modules/review/review.service.js';
import type { RoleService } from '../modules/role/role.service.js';
import type { SeasonService } from '../modules/season/season.service.js';
import type { SerieService } from '../modules/serie/serie.service.js';
import type { UserService } from '../modules/user/user.service.js';
import type { AuthUser } from '../shared/types/index.js';

export interface DIContext {
  authService: AuthService;
  episodeService: EpisodeService;
  favoriteService: FavoriteService;
  genreService: GenreService;
  movieService: MovieService;
  reviewService: ReviewService;
  roleService: RoleService;
  seasonService: SeasonService;
  serieService: SerieService;
  userService: UserService;
}

export interface GraphQLContext {
  user: AuthUser | null;
  di: DIContext;
}

export type GraphQLContextWithUser = GraphQLContext & { user: AuthUser };
