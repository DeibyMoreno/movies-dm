import type { PaginationParams } from '../../lib/helpers/pagination.js';

import { SerieMapper, type SerieDTO } from './serie.mapper.js';
import type { SerieRepository } from './serie.repository.js';

export class SerieService {
  constructor(private readonly serieRepository: SerieRepository) {}

  async findAll(pagination: PaginationParams): Promise<SerieDTO[]> {
    const series = await this.serieRepository.findAll(pagination);
    return series.map(SerieMapper.toDTO);
  }

  async findById(id: string): Promise<SerieDTO | null> {
    const serie = await this.serieRepository.findById(id);
    return serie ? SerieMapper.toDTO(serie) : null;
  }

  async findBySlug(slug: string): Promise<SerieDTO | null> {
    const serie = await this.serieRepository.findBySlug(slug);
    return serie ? SerieMapper.toDTO(serie) : null;
  }
}
