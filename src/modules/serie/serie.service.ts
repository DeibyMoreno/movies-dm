import type { PaginationParams } from '../../lib/helpers/pagination.js';

import { SerieMapper, type SerieDTO } from './serie.mapper.js';
import type { CreateSerieData, UpdateSerieData } from './serie.model.js';
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

  async findByGenreId(genreId: string, pagination: PaginationParams): Promise<SerieDTO[]> {
    const series = await this.serieRepository.findByGenreId(genreId, pagination);
    return series.map(SerieMapper.toDTO);
  }

  async create(data: CreateSerieData): Promise<SerieDTO> {
    const serie = await this.serieRepository.create(data);
    return SerieMapper.toDTO(serie);
  }

  async update(id: string, data: UpdateSerieData): Promise<SerieDTO | null> {
    const serie = await this.serieRepository.update(id, data);
    return serie ? SerieMapper.toDTO(serie) : null;
  }

  async delete(id: string): Promise<boolean> {
    return this.serieRepository.delete(id);
  }
}
