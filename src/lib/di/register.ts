import { asClass, type AwilixContainer } from 'awilix';

import { GenreRepository } from '../../modules/genre/genre.repository.js';
import { GenreService } from '../../modules/genre/genre.service.js';

export function registerDependencies(container: AwilixContainer): void {
  container.register({
    genreRepository: asClass(GenreRepository).singleton(),
    genreService: asClass(GenreService).singleton(),
  });
}
