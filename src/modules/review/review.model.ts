export interface ReviewModel {
  id: string;
  user_id: string;
  movie_id: string | null;
  serie_id: string | null;
  rating: number;
  comment: string | null;
  created_at: Date;
}

export interface CreateReviewData {
  userId: string;
  movieId?: string | null;
  serieId?: string | null;
  rating: number;
  comment?: string | null;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string | null;
}
