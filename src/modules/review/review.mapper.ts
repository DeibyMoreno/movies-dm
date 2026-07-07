import type { ReviewModel } from './review.model.js';

export interface ReviewDTO {
  id: string;
  userId: string;
  movieId: string | null;
  serieId: string | null;
  rating: number;
  comment: string | null;
  createdAt: Date;
}

export class ReviewMapper {
  static toDTO(model: ReviewModel): ReviewDTO {
    return {
      id: model.id,
      userId: model.user_id,
      movieId: model.movie_id,
      serieId: model.serie_id,
      rating: model.rating,
      comment: model.comment,
      createdAt: model.created_at,
    };
  }
}
