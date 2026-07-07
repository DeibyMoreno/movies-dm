import { EpisodeMapper, type EpisodeDTO } from './episode.mapper.js';
import type { EpisodeRepository } from './episode.repository.js';

export class EpisodeService {
  constructor(private readonly episodeRepository: EpisodeRepository) {}

  async findBySeasonId(seasonId: string): Promise<EpisodeDTO[]> {
    const episodes = await this.episodeRepository.findBySeasonId(seasonId);
    return episodes.map(EpisodeMapper.toDTO);
  }

  async findById(id: string): Promise<EpisodeDTO | null> {
    const episode = await this.episodeRepository.findById(id);
    return episode ? EpisodeMapper.toDTO(episode) : null;
  }
}
