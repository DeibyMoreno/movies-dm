import type { SeasonModel } from './season.model.js';

export interface SeasonDTO {
  id: string;
  serieId: string;
  number: number;
  title: string | null;
  releaseYear: number | null;
  createdAt: Date;
}

export class SeasonMapper {
  static toDTO(model: SeasonModel): SeasonDTO {
    return {
      id: model.id,
      serieId: model.serie_id,
      number: model.number,
      title: model.title,
      releaseYear: model.release_year,
      createdAt: model.created_at,
    };
  }
}
