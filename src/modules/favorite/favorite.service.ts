import type { PaginationParams } from '../../lib/helpers/pagination.js';

import { FavoriteMapper, type FavoriteDTO } from './favorite.mapper.js';
import type { CreateFavoriteData } from './favorite.model.js';
import type { FavoriteRepository } from './favorite.repository.js';

export class FavoriteService {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  async findByUserId(userId: string, pagination: PaginationParams): Promise<FavoriteDTO[]> {
    const favorites = await this.favoriteRepository.findByUserId(userId, pagination);
    return favorites.map(FavoriteMapper.toDTO);
  }

  async toggle(data: CreateFavoriteData): Promise<{ added: boolean; favorite: FavoriteDTO | null }> {
    if (data.movieId) {
      const existing = await this.favoriteRepository.findByUserAndMovie(data.userId, data.movieId);
      if (existing) {
        await this.favoriteRepository.delete(existing.id);
        return { added: false, favorite: null };
      }
      const favorite = await this.favoriteRepository.create(data);
      return { added: true, favorite: FavoriteMapper.toDTO(favorite) };
    }

    if (data.serieId) {
      const existing = await this.favoriteRepository.findByUserAndSerie(data.userId, data.serieId);
      if (existing) {
        await this.favoriteRepository.delete(existing.id);
        return { added: false, favorite: null };
      }
      const favorite = await this.favoriteRepository.create(data);
      return { added: true, favorite: FavoriteMapper.toDTO(favorite) };
    }

    return { added: false, favorite: null };
  }
}
