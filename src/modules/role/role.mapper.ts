import type { RoleModel } from './role.model.js';

export interface RoleDTO {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
}

export class RoleMapper {
  static toDTO(model: RoleModel): RoleDTO {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      createdAt: model.created_at,
    };
  }
}
