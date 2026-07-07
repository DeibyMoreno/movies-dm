import { query } from '../../config/database.js';

import type { EpisodeModel } from './episode.model.js';

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
}
