import type { PoolClient } from 'pg';

import { getClient, query } from '../../config/database.js';
import type { PaginationParams } from '../../lib/helpers/pagination.js';

import type { CreateMovieData, MovieModel, UpdateMovieData } from './movie.model.js';

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

  async create(data: CreateMovieData): Promise<MovieModel> {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const movieResult = await client.query<MovieModel>(
        `INSERT INTO movies (title, slug, synopsis, release_year, duration_min, poster_url, backdrop_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          data.title,
          data.slug,
          data.synopsis ?? null,
          data.releaseYear ?? null,
          data.durationMin ?? null,
          data.posterUrl ?? null,
          data.backdropUrl ?? null,
        ],
      );

      const movie = movieResult.rows[0];

      if (data.genreIds && data.genreIds.length > 0) {
        await this.syncGenres(client, movie.id, data.genreIds);
      }

      await client.query('COMMIT');
      return movie;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id: string, data: UpdateMovieData): Promise<MovieModel | null> {
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
      if (data.durationMin !== undefined) {
        setClauses.push(`duration_min = $${paramIndex++}`);
        values.push(data.durationMin);
      }
      if (data.posterUrl !== undefined) {
        setClauses.push(`poster_url = $${paramIndex++}`);
        values.push(data.posterUrl);
      }
      if (data.backdropUrl !== undefined) {
        setClauses.push(`backdrop_url = $${paramIndex++}`);
        values.push(data.backdropUrl);
      }

      if (setClauses.length > 0) {
        values.push(id);
        const updateResult = await client.query<MovieModel>(
          `UPDATE movies SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
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

      const movieResult = await client.query<MovieModel>(
        'SELECT * FROM movies WHERE id = $1',
        [id],
      );

      await client.query('COMMIT');
      return movieResult.rows[0] ?? null;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM movies WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  private async syncGenres(client: PoolClient, movieId: string, genreIds: string[]): Promise<void> {
    await client.query('DELETE FROM movies_genres WHERE movie_id = $1', [movieId]);

    for (const genreId of genreIds) {
      await client.query(
        'INSERT INTO movies_genres (movie_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [movieId, genreId],
      );
    }
  }
}
