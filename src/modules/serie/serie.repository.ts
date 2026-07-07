import { query } from '../../config/database.js';
import type { PaginationParams } from '../../lib/helpers/pagination.js';

import type { SerieModel } from './serie.model.js';

export class SerieRepository {
  async findAll(pagination: PaginationParams): Promise<SerieModel[]> {
    const result = await query<SerieModel>(
      'SELECT * FROM series ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [pagination.limit, pagination.offset],
    );
    return result.rows;
  }

  async findById(id: string): Promise<SerieModel | null> {
    const result = await query<SerieModel>('SELECT * FROM series WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  }

  async findBySlug(slug: string): Promise<SerieModel | null> {
    const result = await query<SerieModel>('SELECT * FROM series WHERE slug = $1', [slug]);
    return result.rows[0] ?? null;
  }

  async findByGenreId(genreId: string, pagination: PaginationParams): Promise<SerieModel[]> {
    const result = await query<SerieModel>(
      `SELECT s.* FROM series s
       INNER JOIN series_genres sg ON sg.serie_id = s.id
       WHERE sg.genre_id = $1
       ORDER BY s.created_at DESC LIMIT $2 OFFSET $3`,
      [genreId, pagination.limit, pagination.offset],
    );
    return result.rows;
  }

  async countAll(): Promise<number> {
    const result = await query<{ count: string }>('SELECT COUNT(*) as count FROM series');
    return parseInt(result.rows[0].count, 10);
  }
}
