import { asClass, type AwilixContainer } from 'awilix';

import { GenreRepository } from '../../modules/genre/genre.repository.js';
import { GenreService } from '../../modules/genre/genre.service.js';
import { RoleRepository } from '../../modules/role/role.repository.js';
import { RoleService } from '../../modules/role/role.service.js';

export function registerDependencies(container: AwilixContainer): void {
  container.register({
    genreRepository: asClass(GenreRepository).singleton(),
    genreService: asClass(GenreService).singleton(),
    roleRepository: asClass(RoleRepository).singleton(),
    roleService: asClass(RoleService).singleton(),
  });
}
