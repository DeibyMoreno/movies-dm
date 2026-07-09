import { asClass, type AwilixContainer } from 'awilix';

import { AuthRepository } from '../../modules/auth/auth.repository.js';
import { AuthService } from '../../modules/auth/auth.service.js';
import { EpisodeRepository } from '../../modules/episode/episode.repository.js';
import { EpisodeService } from '../../modules/episode/episode.service.js';
import { GenreRepository } from '../../modules/genre/genre.repository.js';
import { GenreService } from '../../modules/genre/genre.service.js';
import { MovieRepository } from '../../modules/movie/movie.repository.js';
import { MovieService } from '../../modules/movie/movie.service.js';
import { ReviewRepository } from '../../modules/review/review.repository.js';
import { ReviewService } from '../../modules/review/review.service.js';
import { RoleRepository } from '../../modules/role/role.repository.js';
import { RoleService } from '../../modules/role/role.service.js';
import { SeasonRepository } from '../../modules/season/season.repository.js';
import { SeasonService } from '../../modules/season/season.service.js';
import { SerieRepository } from '../../modules/serie/serie.repository.js';
import { SerieService } from '../../modules/serie/serie.service.js';
import { UserRepository } from '../../modules/user/user.repository.js';
import { UserService } from '../../modules/user/user.service.js';

export function registerDependencies(container: AwilixContainer): void {
  container.register({
    authRepository: asClass(AuthRepository).singleton(),
    authService: asClass(AuthService).singleton(),
    episodeRepository: asClass(EpisodeRepository).singleton(),
    episodeService: asClass(EpisodeService).singleton(),
    genreRepository: asClass(GenreRepository).singleton(),
    genreService: asClass(GenreService).singleton(),
    movieRepository: asClass(MovieRepository).singleton(),
    movieService: asClass(MovieService).singleton(),
    reviewRepository: asClass(ReviewRepository).singleton(),
    reviewService: asClass(ReviewService).singleton(),
    roleRepository: asClass(RoleRepository).singleton(),
    roleService: asClass(RoleService).singleton(),
    seasonRepository: asClass(SeasonRepository).singleton(),
    seasonService: asClass(SeasonService).singleton(),
    serieRepository: asClass(SerieRepository).singleton(),
    serieService: asClass(SerieService).singleton(),
    userRepository: asClass(UserRepository).singleton(),
    userService: asClass(UserService).singleton(),
  });
}
