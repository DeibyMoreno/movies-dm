import type { UserModel } from './user.model.js';

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserMapper {
  static toDTO(model: UserModel): UserDTO {
    return {
      id: model.id,
      email: model.email,
      name: model.name,
      avatarUrl: model.avatar_url,
      roleId: model.role_id,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    };
  }

  static toPublicDTO(model: UserModel): UserDTO {
    return UserMapper.toDTO(model);
  }
}
