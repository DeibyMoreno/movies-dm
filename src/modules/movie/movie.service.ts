import type { PaginationParams } from '../../lib/helpers/pagination.js';

import { MovieMapper, type MovieDTO } from './movie.mapper.js';
import type { CreateMovieData, UpdateMovieData } from './movie.model.js';
import type { MovieRepository } from './movie.repository.js';

export class MovieService {
  constructor(private readonly movieRepository: MovieRepository) {}

  async findAll(pagination: PaginationParams): Promise<MovieDTO[]> {
    const movies = await this.movieRepository.findAll(pagination);
    return movies.map(MovieMapper.toDTO);
  }

  async findById(id: string): Promise<MovieDTO | null> {
    const movie = await this.movieRepository.findById(id);
    return movie ? MovieMapper.toDTO(movie) : null;
  }

  async findBySlug(slug: string): Promise<MovieDTO | null> {
    const movie = await this.movieRepository.findBySlug(slug);
    return movie ? MovieMapper.toDTO(movie) : null;
  }

  async create(data: CreateMovieData): Promise<MovieDTO> {
    const movie = await this.movieRepository.create(data);
    return MovieMapper.toDTO(movie);
  }

  async update(id: string, data: UpdateMovieData): Promise<MovieDTO | null> {
    const movie = await this.movieRepository.update(id, data);
    return movie ? MovieMapper.toDTO(movie) : null;
  }

  async delete(id: string): Promise<boolean> {
    return this.movieRepository.delete(id);
  }
}
