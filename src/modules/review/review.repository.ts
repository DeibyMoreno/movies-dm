import { query } from '../../config/database.js';
import type { PaginationParams } from '../../lib/helpers/pagination.js';

import type { CreateReviewData, ReviewModel, UpdateReviewData } from './review.model.js';

export class ReviewRepository {
  async findAll(pagination: PaginationParams): Promise<ReviewModel[]> {
    const result = await query<ReviewModel>(
      'SELECT * FROM reviews ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [pagination.limit, pagination.offset],
    );
    return result.rows;
  }

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

  async create(data: CreateReviewData): Promise<ReviewModel> {
    const result = await query<ReviewModel>(
      `INSERT INTO reviews (user_id, movie_id, serie_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.userId, data.movieId ?? null, data.serieId ?? null, data.rating, data.comment ?? null],
    );
    return result.rows[0];
  }

  async update(id: string, data: UpdateReviewData): Promise<ReviewModel | null> {
    const setClauses: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.rating !== undefined) {
      setClauses.push(`rating = $${paramIndex++}`);
      values.push(data.rating);
    }
    if (data.comment !== undefined) {
      setClauses.push(`comment = $${paramIndex++}`);
      values.push(data.comment);
    }

    if (setClauses.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await query<ReviewModel>(
      `UPDATE reviews SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values,
    );
    return result.rows[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM reviews WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
