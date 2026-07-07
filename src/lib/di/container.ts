import {
  createContainer,
  type AwilixContainer,
  type Resolver,
  asClass,
  asFunction,
  asValue,
} from 'awilix';

import type { GenreRepository } from '../../modules/genre/genre.repository.js';
import type { GenreService } from '../../modules/genre/genre.service.js';

export type { AwilixContainer, Resolver };

export { asClass, asFunction, asValue };

export interface Dependencies {
  genreRepository: GenreRepository;
  genreService: GenreService;
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
