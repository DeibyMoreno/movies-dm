import { query } from '../../config/database.js';
import type { PaginationParams } from '../../lib/helpers/pagination.js';

import type { ReviewModel } from './review.model.js';

export class ReviewRepository {
  async findByMovieId(movieId: string, pagination: PaginationParams): Promise<ReviewModel[]> {
    const result = await query<ReviewModel>(
      'SELECT * FROM reviews WHERE movie_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [movieId, pagination.limit, pagination.offset],
    );
    return result.rows;
  }

  async findBySerieId(serieId: string, pagination: PaginationParams): Promise<ReviewModel[]> {
    const result = await query<ReviewModel>(
      'SELECT * FROM reviews WHERE serie_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [serieId, pagination.limit, pagination.offset],
    );
    return result.rows;
  }

  async findById(id: string): Promise<ReviewModel | null> {
    const result = await query<ReviewModel>('SELECT * FROM reviews WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  }

  async findByUserId(userId: string, pagination: PaginationParams): Promise<ReviewModel[]> {
    const result = await query<ReviewModel>(
      'SELECT * FROM reviews WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, pagination.limit, pagination.offset],
    );
    return result.rows;
  }

  async countByMovieId(movieId: string): Promise<number> {
    const result = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM reviews WHERE movie_id = $1',
      [movieId],
    );
    return parseInt(result.rows[0].count, 10);
  }

  async countBySerieId(serieId: string): Promise<number> {
    const result = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM reviews WHERE serie_id = $1',
      [serieId],
    );
    return parseInt(result.rows[0].count, 10);
  }
}
