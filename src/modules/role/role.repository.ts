import { query } from '../../config/database.js';
import type { PaginationParams } from '../../lib/helpers/pagination.js';

import type { RoleModel } from './role.model.js';

export class RoleRepository {
  async findAll(pagination: PaginationParams): Promise<RoleModel[]> {
    const result = await query<RoleModel>(
      'SELECT * FROM roles ORDER BY name ASC LIMIT $1 OFFSET $2',
      [pagination.limit, pagination.offset],
    );

    return result.rows;
  }

  async findById(id: string): Promise<RoleModel | null> {
    const result = await query<RoleModel>('SELECT * FROM roles WHERE id = $1', [id]);

    return result.rows[0] ?? null;
  }

  async findByName(name: string): Promise<RoleModel | null> {
    const result = await query<RoleModel>('SELECT * FROM roles WHERE name = $1', [name]);

    return result.rows[0] ?? null;
  }

  async countAll(): Promise<number> {
    const result = await query<{ count: string }>('SELECT COUNT(*) as count FROM roles');

    return parseInt(result.rows[0].count, 10);
  }
}
