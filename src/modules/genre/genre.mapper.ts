import type { GenreModel } from './genre.model.js';

export interface GenreDTO {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export class GenreMapper {
  static toDTO(model: GenreModel): GenreDTO {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      createdAt: model.created_at,
    };
  }
}
