import type { SerieModel } from './serie.model.js';

export interface SerieDTO {
  id: string;
  title: string;
  slug: string;
  synopsis: string | null;
  releaseYear: number | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  rating: number | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export class SerieMapper {
  static toDTO(model: SerieModel): SerieDTO {
    return {
      id: model.id,
      title: model.title,
      slug: model.slug,
      synopsis: model.synopsis,
      releaseYear: model.release_year,
      posterUrl: model.poster_url,
      backdropUrl: model.backdrop_url,
      rating: model.rating,
      status: model.status,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    };
  }
}
