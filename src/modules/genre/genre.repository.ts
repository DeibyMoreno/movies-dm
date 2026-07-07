import { query } from '../../config/database.js';

import type { GenreModel } from './genre.model.js';

export class GenreRepository {
  async findAll(): Promise<GenreModel[]> {
    const result = await query<GenreModel>('SELECT * FROM genres ORDER BY name ASC');
    return result.rows;
  }

  async findById(id: string): Promise<GenreModel | null> {
    const result = await query<GenreModel>('SELECT * FROM genres WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  }

  async findBySlug(slug: string): Promise<GenreModel | null> {
    const result = await query<GenreModel>('SELECT * FROM genres WHERE slug = $1', [slug]);
    return result.rows[0] ?? null;
  }

  async findByMovieId(movieId: string): Promise<GenreModel[]> {
    const result = await query<GenreModel>(
      `SELECT g.* FROM genres g
       INNER JOIN movies_genres mg ON mg.genre_id = g.id
       WHERE mg.movie_id = $1
       ORDER BY g.name ASC`,
      [movieId],
    );
    return result.rows;
  }

  async findBySerieId(serieId: string): Promise<GenreModel[]> {
    const result = await query<GenreModel>(
      `SELECT g.* FROM genres g
       INNER JOIN series_genres sg ON sg.genre_id = g.id
       WHERE sg.serie_id = $1
       ORDER BY g.name ASC`,
      [serieId],
    );
    return result.rows;
  }

  async create(data: { name: string; slug: string }): Promise<GenreModel> {
    const result = await query<GenreModel>(
      'INSERT INTO genres (name, slug) VALUES ($1, $2) RETURNING *',
      [data.name, data.slug],
    );
    return result.rows[0];
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM genres WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
