export interface SeasonModel {
  id: string;
  serie_id: string;
  number: number;
  title: string | null;
  release_year: number | null;
  created_at: Date;
}
