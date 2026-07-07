import type { EpisodeModel } from './episode.model.js';

export interface EpisodeDTO {
  id: string;
  seasonId: string;
  number: number;
  title: string;
  synopsis: string | null;
  durationMin: number | null;
  releaseDate: Date | null;
  videoUrl: string | null;
  createdAt: Date;
}

export class EpisodeMapper {
  static toDTO(model: EpisodeModel): EpisodeDTO {
    return {
      id: model.id,
      seasonId: model.season_id,
      number: model.number,
      title: model.title,
      synopsis: model.synopsis,
      durationMin: model.duration_min,
      releaseDate: model.release_date,
      videoUrl: model.video_url,
      createdAt: model.created_at,
    };
  }
}
