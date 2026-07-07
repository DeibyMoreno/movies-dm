export interface MovieModel {
  id: string;
  title: string;
  slug: string;
  synopsis: string | null;
  release_year: number | null;
  duration_min: number | null;
  poster_url: string | null;
  backdrop_url: string | null;
  rating: number | null;
  created_at: Date;
  updated_at: Date;
}
