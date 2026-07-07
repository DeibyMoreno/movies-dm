import type { PaginationParams } from '../../lib/helpers/pagination.js';

import { FavoriteMapper, type FavoriteDTO } from './favorite.mapper.js';
import type { FavoriteRepository } from './favorite.repository.js';

export class FavoriteService {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  async findByUserId(userId: string, pagination: PaginationParams): Promise<FavoriteDTO[]> {
    const favorites = await this.favoriteRepository.findByUserId(userId, pagination);
    return favorites.map(FavoriteMapper.toDTO);
  }
}
