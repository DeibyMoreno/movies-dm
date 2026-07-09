import { query } from '../../config/database.js';
import type { PaginationParams } from '../../lib/helpers/pagination.js';

import type { CreateFavoriteData, FavoriteModel } from './favorite.model.js';

export class FavoriteRepository {
  async findByUserId(userId: string, pagination: PaginationParams): Promise<FavoriteModel[]> {
    const result = await query<FavoriteModel>(
      'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, pagination.limit, pagination.offset],
    );
    return result.rows;
  }

  async findByUserAndMovie(userId: string, movieId: string): Promise<FavoriteModel | null> {
    const result = await query<FavoriteModel>(
      'SELECT * FROM favorites WHERE user_id = $1 AND movie_id = $2',
      [userId, movieId],
    );
    return result.rows[0] ?? null;
  }

  async findByUserAndSerie(userId: string, serieId: string): Promise<FavoriteModel | null> {
    const result = await query<FavoriteModel>(
      'SELECT * FROM favorites WHERE user_id = $1 AND serie_id = $2',
      [userId, serieId],
    );
    return result.rows[0] ?? null;
  }

  async create(data: CreateFavoriteData): Promise<FavoriteModel> {
    const result = await query<FavoriteModel>(
      `INSERT INTO favorites (user_id, movie_id, serie_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.userId, data.movieId ?? null, data.serieId ?? null],
    );
    return result.rows[0];
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM favorites WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async deleteByUserAndMovie(userId: string, movieId: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM favorites WHERE user_id = $1 AND movie_id = $2',
      [userId, movieId],
    );
    return (result.rowCount ?? 0) > 0;
  }

  async deleteByUserAndSerie(userId: string, serieId: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM favorites WHERE user_id = $1 AND serie_id = $2',
      [userId, serieId],
    );
    return (result.rowCount ?? 0) > 0;
  }
}
