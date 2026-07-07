export interface EpisodeModel {
  id: string;
  season_id: string;
  number: number;
  title: string;
  synopsis: string | null;
  duration_min: number | null;
  release_date: Date | null;
  video_url: string | null;
  created_at: Date;
}
