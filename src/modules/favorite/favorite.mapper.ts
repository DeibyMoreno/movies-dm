import type { FavoriteModel } from './favorite.model.js';

export interface FavoriteDTO {
  id: string;
  userId: string;
  movieId: string | null;
  serieId: string | null;
  createdAt: Date;
}

export class FavoriteMapper {
  static toDTO(model: FavoriteModel): FavoriteDTO {
    return {
      id: model.id,
      userId: model.user_id,
      movieId: model.movie_id,
      serieId: model.serie_id,
      createdAt: model.created_at,
    };
  }
}
