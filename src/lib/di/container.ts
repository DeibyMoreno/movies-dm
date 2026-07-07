import {
  createContainer,
  type AwilixContainer,
  type Resolver,
  asClass,
  asFunction,
  asValue,
} from 'awilix';

import type { AuthService } from '../../modules/auth/auth.service.js';
import type { GenreRepository } from '../../modules/genre/genre.repository.js';
import type { GenreService } from '../../modules/genre/genre.service.js';
import type { RoleRepository } from '../../modules/role/role.repository.js';
import type { RoleService } from '../../modules/role/role.service.js';
import type { UserRepository } from '../../modules/user/user.repository.js';
import type { UserService } from '../../modules/user/user.service.js';

export type { AwilixContainer, Resolver };

export { asClass, asFunction, asValue };

export interface Dependencies {
  authService: AuthService;
  genreRepository: GenreRepository;
  genreService: GenreService;
  roleRepository: RoleRepository;
  roleService: RoleService;
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
