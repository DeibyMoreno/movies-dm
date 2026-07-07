import { SeasonMapper, type SeasonDTO } from './season.mapper.js';
import type { SeasonRepository } from './season.repository.js';

export class SeasonService {
  constructor(private readonly seasonRepository: SeasonRepository) {}

  async findBySerieId(serieId: string): Promise<SeasonDTO[]> {
    const seasons = await this.seasonRepository.findBySerieId(serieId);
    return seasons.map(SeasonMapper.toDTO);
  }

  async findById(id: string): Promise<SeasonDTO | null> {
    const season = await this.seasonRepository.findById(id);
    return season ? SeasonMapper.toDTO(season) : null;
  }
}
