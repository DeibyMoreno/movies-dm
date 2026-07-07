import type { MovieModel } from './movie.model.js';

export interface MovieDTO {
  id: string;
  title: string;
  slug: string;
  synopsis: string | null;
  releaseYear: number | null;
  durationMin: number | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  rating: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export class MovieMapper {
  static toDTO(model: MovieModel): MovieDTO {
    return {
      id: model.id,
      title: model.title,
      slug: model.slug,
      synopsis: model.synopsis,
      releaseYear: model.release_year,
      durationMin: model.duration_min,
      posterUrl: model.poster_url,
      backdropUrl: model.backdrop_url,
      rating: model.rating,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    };
  }
}
