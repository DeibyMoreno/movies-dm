import { SeasonMapper, type SeasonDTO } from './season.mapper.js';
import type { CreateSeasonData, UpdateSeasonData } from './season.model.js';
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

  async create(data: CreateSeasonData): Promise<SeasonDTO> {
    const season = await this.seasonRepository.create(data);
    return SeasonMapper.toDTO(season);
  }

  async update(id: string, data: UpdateSeasonData): Promise<SeasonDTO | null> {
    const season = await this.seasonRepository.update(id, data);
    return season ? SeasonMapper.toDTO(season) : null;
  }

  async delete(id: string): Promise<boolean> {
    return this.seasonRepository.delete(id);
  }
}
