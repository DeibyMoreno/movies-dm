import { query } from '../../config/database.js';

import type { CreateEpisodeData, EpisodeModel, UpdateEpisodeData } from './episode.model.js';

export class EpisodeRepository {
  async findBySeasonId(seasonId: string): Promise<EpisodeModel[]> {
    const result = await query<EpisodeModel>(
      'SELECT * FROM episodes WHERE season_id = $1 ORDER BY number ASC',
      [seasonId],
    );
    return result.rows;
  }

  async findById(id: string): Promise<EpisodeModel | null> {
    const result = await query<EpisodeModel>('SELECT * FROM episodes WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  }

  async create(data: CreateEpisodeData): Promise<EpisodeModel> {
    const result = await query<EpisodeModel>(
      `INSERT INTO episodes (season_id, number, title, synopsis, duration_min, release_date, video_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.seasonId,
        data.number,
        data.title,
        data.synopsis ?? null,
        data.durationMin ?? null,
        data.releaseDate ?? null,
        data.videoUrl ?? null,
      ],
    );
    return result.rows[0];
  }

  async update(id: string, data: UpdateEpisodeData): Promise<EpisodeModel | null> {
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
    if (data.synopsis !== undefined) {
      setClauses.push(`synopsis = $${paramIndex++}`);
      values.push(data.synopsis);
    }
    if (data.durationMin !== undefined) {
      setClauses.push(`duration_min = $${paramIndex++}`);
      values.push(data.durationMin);
    }
    if (data.releaseDate !== undefined) {
      setClauses.push(`release_date = $${paramIndex++}`);
      values.push(data.releaseDate);
    }
    if (data.videoUrl !== undefined) {
      setClauses.push(`video_url = $${paramIndex++}`);
      values.push(data.videoUrl);
    }

    if (setClauses.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await query<EpisodeModel>(
      `UPDATE episodes SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values,
    );
    return result.rows[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM episodes WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
