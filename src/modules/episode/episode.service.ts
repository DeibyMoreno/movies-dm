import { EpisodeMapper, type EpisodeDTO } from './episode.mapper.js';
import type { CreateEpisodeData, UpdateEpisodeData } from './episode.model.js';
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

  async create(data: CreateEpisodeData): Promise<EpisodeDTO> {
    const episode = await this.episodeRepository.create(data);
    return EpisodeMapper.toDTO(episode);
  }

  async update(id: string, data: UpdateEpisodeData): Promise<EpisodeDTO | null> {
    const episode = await this.episodeRepository.update(id, data);
    return episode ? EpisodeMapper.toDTO(episode) : null;
  }

  async delete(id: string): Promise<boolean> {
    return this.episodeRepository.delete(id);
  }
}
