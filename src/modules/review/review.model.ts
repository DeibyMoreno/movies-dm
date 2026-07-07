export interface ReviewModel {
  id: string;
  user_id: string;
  movie_id: string | null;
  serie_id: string | null;
  rating: number;
  comment: string | null;
  created_at: Date;
}
