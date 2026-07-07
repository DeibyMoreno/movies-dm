import { query } from '../../config/database.js';

import type { SeasonModel } from './season.model.js';

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
}
