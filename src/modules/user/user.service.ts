import type { PaginationParams } from '../../lib/helpers/pagination.js';

import { UserMapper, type UserDTO } from './user.mapper.js';
import type { UserRepository } from './user.repository.js';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(pagination: PaginationParams): Promise<UserDTO[]> {
    const users = await this.userRepository.findAll(pagination);
    return users.map(UserMapper.toPublicDTO);
  }

  async findById(id: string): Promise<UserDTO | null> {
    const user = await this.userRepository.findById(id);
    return user ? UserMapper.toPublicDTO(user) : null;
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    const user = await this.userRepository.findByEmail(email);
    return user ? UserMapper.toPublicDTO(user) : null;
  }
}
