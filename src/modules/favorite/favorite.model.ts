export interface FavoriteModel {
  id: string;
  user_id: string;
  movie_id: string | null;
  serie_id: string | null;
  created_at: Date;
}
