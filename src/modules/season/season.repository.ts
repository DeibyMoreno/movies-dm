import { query } from '../../config/database.js';

import type { CreateSeasonData, SeasonModel, UpdateSeasonData } from './season.model.js';

export class SeasonRepository {
  async findBySerieId(serieId: string): Promise<SeasonModel[]> {
    const result = await query<SeasonModel>(
      'SELECT * FROM seasons WHERE serie_id = $1 ORDER BY number ASC',
      [serieId],
    );
    return result.rows;
  }

  async findById(id: string): Promise<SeasonModel | null> {
    const result = await query<SeasonModel>('SELECT * FROM seasons WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  }

  async create(data: CreateSeasonData): Promise<SeasonModel> {
    const result = await query<SeasonModel>(
      `INSERT INTO seasons (serie_id, number, title, release_year)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.serieId, data.number, data.title ?? null, data.releaseYear ?? null],
    );
    return result.rows[0];
  }

  async update(id: string, data: UpdateSeasonData): Promise<SeasonModel | null> {
    const setClauses: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.number !== undefined) {
      setClauses.push(`number = $${paramIndex++}`);
      values.push(data.number);
    }
    if (data.title !== undefined) {
      setClauses.push(`title = $${paramIndex++}`);
      values.push(data.title);
    }
    if (data.releaseYear !== undefined) {
      setClauses.push(`release_year = $${paramIndex++}`);
      values.push(data.releaseYear);
    }

    if (setClauses.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await query<SeasonModel>(
      `UPDATE seasons SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values,
    );
    return result.rows[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM seasons WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
