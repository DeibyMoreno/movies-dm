import { query } from '../../config/database.js';
import type { PaginationParams } from '../../lib/helpers/pagination.js';

import type { UserModel } from './user.model.js';

export class UserRepository {
  async findAll(pagination: PaginationParams): Promise<UserModel[]> {
    const result = await query<UserModel>(
      'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [pagination.limit, pagination.offset],
    );
    return result.rows;
  }

  async findById(id: string): Promise<UserModel | null> {
    const result = await query<UserModel>('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const result = await query<UserModel>('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] ?? null;
  }

  async create(data: {
    email: string;
    password_hash: string;
    name: string;
    role_id: string;
  }): Promise<UserModel> {
    const result = await query<UserModel>(
      'INSERT INTO users (email, password_hash, name, role_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [data.email, data.password_hash, data.name, data.role_id],
    );
    return result.rows[0];
  }

  async findUserWithRoleName(id: string): Promise<{ role_name: string } | null> {
    const result = await query<{ role_name: string }>(
      `SELECT r.name as role_name FROM users u
       INNER JOIN roles r ON r.id = u.role_id
       WHERE u.id = $1`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  async countAll(): Promise<number> {
    const result = await query<{ count: string }>('SELECT COUNT(*) as count FROM users');
    return parseInt(result.rows[0].count, 10);
  }
}
