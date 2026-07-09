import type { PoolClient } from 'pg';

import { getClient, query } from '../../config/database.js';
import type { PaginationParams } from '../../lib/helpers/pagination.js';

import type { CreateSerieData, SerieModel, UpdateSerieData } from './serie.model.js';

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

  async create(data: CreateSerieData): Promise<SerieModel> {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const serieResult = await client.query<SerieModel>(
        `INSERT INTO series (title, slug, synopsis, release_year, poster_url, backdrop_url, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          data.title,
          data.slug,
          data.synopsis ?? null,
          data.releaseYear ?? null,
          data.posterUrl ?? null,
          data.backdropUrl ?? null,
          data.status ?? 'ONGOING',
        ],
      );

      const serie = serieResult.rows[0];

      if (data.genreIds && data.genreIds.length > 0) {
        await this.syncGenres(client, serie.id, data.genreIds);
      }

      await client.query('COMMIT');
      return serie;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id: string, data: UpdateSerieData): Promise<SerieModel | null> {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const setClauses: string[] = [];
      const values: unknown[] = [];
      let paramIndex = 1;

      if (data.title !== undefined) {
        setClauses.push(`title = $${paramIndex++}`);
        values.push(data.title);
      }
      if (data.slug !== undefined) {
        setClauses.push(`slug = $${paramIndex++}`);
        values.push(data.slug);
      }
      if (data.synopsis !== undefined) {
        setClauses.push(`synopsis = $${paramIndex++}`);
        values.push(data.synopsis);
      }
      if (data.releaseYear !== undefined) {
        setClauses.push(`release_year = $${paramIndex++}`);
        values.push(data.releaseYear);
      }
      if (data.posterUrl !== undefined) {
        setClauses.push(`poster_url = $${paramIndex++}`);
        values.push(data.posterUrl);
      }
      if (data.backdropUrl !== undefined) {
        setClauses.push(`backdrop_url = $${paramIndex++}`);
        values.push(data.backdropUrl);
      }
      if (data.status !== undefined) {
        setClauses.push(`status = $${paramIndex++}`);
        values.push(data.status);
      }

      if (setClauses.length > 0) {
        values.push(id);
        const updateResult = await client.query<SerieModel>(
          `UPDATE series SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
          values,
        );

        if (updateResult.rows.length === 0) {
          await client.query('ROLLBACK');
          return null;
        }
      }

      if (data.genreIds !== undefined) {
        await this.syncGenres(client, id, data.genreIds);
      }

      const serieResult = await client.query<SerieModel>(
        'SELECT * FROM series WHERE id = $1',
        [id],
      );

      await client.query('COMMIT');
      return serieResult.rows[0] ?? null;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM series WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  private async syncGenres(client: PoolClient, serieId: string, genreIds: string[]): Promise<void> {
    await client.query('DELETE FROM series_genres WHERE serie_id = $1', [serieId]);

    for (const genreId of genreIds) {
      await client.query(
        'INSERT INTO series_genres (serie_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [serieId, genreId],
      );
    }
  }
}
