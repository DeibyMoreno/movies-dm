export interface SeasonModel {
  id: string;
  serie_id: string;
  number: number;
  title: string | null;
  release_year: number | null;
  created_at: Date;
}

export interface CreateSeasonData {
  serieId: string;
  number: number;
  title?: string | null;
  releaseYear?: number | null;
}

export interface UpdateSeasonData {
  number?: number;
  title?: string | null;
  releaseYear?: number | null;
}
