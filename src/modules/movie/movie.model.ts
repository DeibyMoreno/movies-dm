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

export interface CreateMovieData {
  title: string;
  slug: string;
  synopsis?: string | null;
  releaseYear?: number | null;
  durationMin?: number | null;
  posterUrl?: string | null;
  backdropUrl?: string | null;
  genreIds?: string[];
}

export interface UpdateMovieData {
  title?: string;
  slug?: string;
  synopsis?: string | null;
  releaseYear?: number | null;
  durationMin?: number | null;
  posterUrl?: string | null;
  backdropUrl?: string | null;
  genreIds?: string[];
}
