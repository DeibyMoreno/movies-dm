import { GenreMapper, type GenreDTO } from './genre.mapper.js';
import type { GenreRepository } from './genre.repository.js';

export class GenreService {
  constructor(private readonly genreRepository: GenreRepository) {}

  async findAll(): Promise<GenreDTO[]> {
    const genres = await this.genreRepository.findAll();
    return genres.map(GenreMapper.toDTO);
  }

  async findById(id: string): Promise<GenreDTO | null> {
    const genre = await this.genreRepository.findById(id);
    return genre ? GenreMapper.toDTO(genre) : null;
  }

  async create(data: { name: string; slug: string }): Promise<GenreDTO> {
    const genre = await this.genreRepository.create(data);
    return GenreMapper.toDTO(genre);
  }
}
