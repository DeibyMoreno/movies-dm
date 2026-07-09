export type SerieStatus = 'ONGOING' | 'FINISHED' | 'CANCELED' | 'UPCOMING';

export interface SerieModel {
  id: string;
  title: string;
  slug: string;
  synopsis: string | null;
  release_year: number | null;
  poster_url: string | null;
  backdrop_url: string | null;
  rating: number | null;
  status: SerieStatus;
  created_at: Date;
  updated_at: Date;
}

export interface CreateSerieData {
  title: string;
  slug: string;
  synopsis?: string | null;
  releaseYear?: number | null;
  posterUrl?: string | null;
  backdropUrl?: string | null;
  status?: SerieStatus;
  genreIds?: string[];
}

export interface UpdateSerieData {
  title?: string;
  slug?: string;
  synopsis?: string | null;
  releaseYear?: number | null;
  posterUrl?: string | null;
  backdropUrl?: string | null;
  status?: SerieStatus;
  genreIds?: string[];
}
