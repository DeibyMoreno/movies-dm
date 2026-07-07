import type { PaginationParams } from '../../lib/helpers/pagination.js';

import { RoleMapper, type RoleDTO } from './role.mapper.js';
import type { RoleRepository } from './role.repository.js';

export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async findAll(pagination: PaginationParams): Promise<RoleDTO[]> {
    const roles = await this.roleRepository.findAll(pagination);

    return roles.map(RoleMapper.toDTO);
  }

  async findById(id: string): Promise<RoleDTO | null> {
    const role = await this.roleRepository.findById(id);

    return role ? RoleMapper.toDTO(role) : null;
  }

  async findByName(name: string): Promise<RoleDTO | null> {
    const role = await this.roleRepository.findByName(name);

    return role ? RoleMapper.toDTO(role) : null;
  }

  async create(data: { name: string; description?: string | null }): Promise<RoleDTO> {
    const role = await this.roleRepository.create(data);

    return RoleMapper.toDTO(role);
  }
}
