import {
  createContainer,
  type AwilixContainer,
  type Resolver,
  asClass,
  asFunction,
  asValue,
} from 'awilix';

import type { AuthRepository } from '../../modules/auth/auth.repository.js';
import type { AuthService } from '../../modules/auth/auth.service.js';
import type { EpisodeRepository } from '../../modules/episode/episode.repository.js';
import type { EpisodeService } from '../../modules/episode/episode.service.js';
import type { FavoriteRepository } from '../../modules/favorite/favorite.repository.js';
import type { FavoriteService } from '../../modules/favorite/favorite.service.js';
import type { GenreRepository } from '../../modules/genre/genre.repository.js';
import type { GenreService } from '../../modules/genre/genre.service.js';
import type { MovieRepository } from '../../modules/movie/movie.repository.js';
import type { MovieService } from '../../modules/movie/movie.service.js';
import type { ReviewRepository } from '../../modules/review/review.repository.js';
import type { ReviewService } from '../../modules/review/review.service.js';
import type { RoleRepository } from '../../modules/role/role.repository.js';
import type { RoleService } from '../../modules/role/role.service.js';
import type { SeasonRepository } from '../../modules/season/season.repository.js';
import type { SeasonService } from '../../modules/season/season.service.js';
import type { SerieRepository } from '../../modules/serie/serie.repository.js';
import type { SerieService } from '../../modules/serie/serie.service.js';
import type { UserRepository } from '../../modules/user/user.repository.js';
import type { UserService } from '../../modules/user/user.service.js';

export type { AwilixContainer, Resolver };

export { asClass, asFunction, asValue };

export interface Dependencies {
  authRepository: AuthRepository;
  authService: AuthService;
  episodeRepository: EpisodeRepository;
  episodeService: EpisodeService;
  favoriteRepository: FavoriteRepository;
  favoriteService: FavoriteService;
  genreRepository: GenreRepository;
  genreService: GenreService;
  movieRepository: MovieRepository;
  movieService: MovieService;
  reviewRepository: ReviewRepository;
  reviewService: ReviewService;
  roleRepository: RoleRepository;
  roleService: RoleService;
  seasonRepository: SeasonRepository;
  seasonService: SeasonService;
  serieRepository: SerieRepository;
  serieService: SerieService;
  userRepository: UserRepository;
  userService: UserService;
}

let container: AwilixContainer | null = null;

export function createDIContainer(): AwilixContainer {
  if (container) {
    return container;
  }

  container = createContainer({
    injectionMode: 'CLASSIC',
  });

  return container;
}

export function getContainer(): AwilixContainer {
  if (!container) {
    return createDIContainer();
  }
  return container;
}

export function resetContainer(): void {
  container = null;
}
