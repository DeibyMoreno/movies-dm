import { query } from '../../config/database.js';
import type { PaginationParams } from '../../lib/helpers/pagination.js';

import type { MovieModel } from './movie.model.js';

export class MovieRepository {
  async findAll(pagination: PaginationParams): Promise<MovieModel[]> {
    const result = await query<MovieModel>(
      'SELECT * FROM movies ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [pagination.limit, pagination.offset],
    );
    return result.rows;
  }

  async findById(id: string): Promise<MovieModel | null> {
    const result = await query<MovieModel>('SELECT * FROM movies WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  }

  async findBySlug(slug: string): Promise<MovieModel | null> {
    const result = await query<MovieModel>('SELECT * FROM movies WHERE slug = $1', [slug]);
    return result.rows[0] ?? null;
  }

  async findByGenreId(genreId: string, pagination: PaginationParams): Promise<MovieModel[]> {
    const result = await query<MovieModel>(
      `SELECT m.* FROM movies m
       INNER JOIN movies_genres mg ON mg.movie_id = m.id
       WHERE mg.genre_id = $1
       ORDER BY m.created_at DESC LIMIT $2 OFFSET $3`,
      [genreId, pagination.limit, pagination.offset],
    );
    return result.rows;
  }

  async countAll(): Promise<number> {
    const result = await query<{ count: string }>('SELECT COUNT(*) as count FROM movies');
    return parseInt(result.rows[0].count, 10);
  }

  async countByGenreId(genreId: string): Promise<number> {
    const result = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM movies_genres WHERE genre_id = $1',
      [genreId],
    );
    return parseInt(result.rows[0].count, 10);
  }
}
