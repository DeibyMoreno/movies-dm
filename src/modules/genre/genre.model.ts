export interface GenreModel {
  id: string;
  name: string;
  slug: string;
  created_at: Date;
}

export interface CreateGenreInput {
  name: string;
  slug: string;
}

export interface GenreMovieModel {
  movie_id: string;
  genre_id: string;
}

export interface GenreSerieModel {
  serie_id: string;
  genre_id: string;
}
