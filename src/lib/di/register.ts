import { asClass, type AwilixContainer } from 'awilix';

import { AuthService } from '../../modules/auth/auth.service.js';
import { GenreRepository } from '../../modules/genre/genre.repository.js';
import { GenreService } from '../../modules/genre/genre.service.js';
import { RoleRepository } from '../../modules/role/role.repository.js';
import { RoleService } from '../../modules/role/role.service.js';
import { UserRepository } from '../../modules/user/user.repository.js';
import { UserService } from '../../modules/user/user.service.js';

export function registerDependencies(container: AwilixContainer): void {
  container.register({
    authService: asClass(AuthService).singleton(),
    genreRepository: asClass(GenreRepository).singleton(),
    genreService: asClass(GenreService).singleton(),
    roleRepository: asClass(RoleRepository).singleton(),
    roleService: asClass(RoleService).singleton(),
    userRepository: asClass(UserRepository).singleton(),
    userService: asClass(UserService).singleton(),
  });
}
