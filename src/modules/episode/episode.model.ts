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

export interface CreateEpisodeData {
  seasonId: string;
  number: number;
  title: string;
  synopsis?: string | null;
  durationMin?: number | null;
  releaseDate?: string | null;
  videoUrl?: string | null;
}

export interface UpdateEpisodeData {
  number?: number;
  title?: string;
  synopsis?: string | null;
  durationMin?: number | null;
  releaseDate?: string | null;
  videoUrl?: string | null;
}
